<?php

namespace App\Http\Controllers;

use DB;
use Input;
use Request;
use Session;
use App\Http\Controllers\Controller;

class WordController extends Controller {
	public function index() {
		return view('word');
	}
	public function show() {
		$name = Request::input('name');
		$words = DB::table('word')->where('name',$name)->get();
		var_dump($words);
	}
	public function getWordsAll() {
		$response['status'] = 1;
		$words = DB::table('word')
				->select('id','name','category','variant','state','origin','family')
				->get();

		$categorys = DB::table('category')
					->orderBy('name')
					->get();
		$response['words'] = $words;
		$response['categorys'] = $categorys;
		return $response;
	}
	public function addWord() {
		date_default_timezone_set('PRC');
		$data['name'] = Request::input('name');
		$data['meaning'] = Request::input('meaning');
		$data['example'] = trim(Request::input('example'));
		$data['variant'] = Request::input('variant');
		$data['origin'] = Request::input('origin');
		$data['category'] = Request::input('category');
		$data['lettertype'] = Request::input('lettertype');
		$data['pronun'] = Request::input('pronun');
		$data['family'] = Request::input('family');
		$word = DB::table('word')->where('name',$data['name'])->where('category',$data['category'])->first();
		$data['count'] = count(preg_split('/\n/',$data['example']));
		if($word) {
			//$data['meaning'] = trim(($word->meaning).$data['meaning']);
			if(!trim($word->example))
				$data['example'] = trim($data['example']);
			else
				$data['example'] = trim($word->example)."\n".trim($data['example']);
			$data['count'] += $word->count;
			//$data['id'] = $word->id;
			DB::table('word')->where('name',$data['name'])->where('category',$data['category'])->update(['example' => $data['example'],'count' => $data['count']]);
		}
		else {
			$data['created_at'] = date('Y-m-d H:i:s');
			$data['updated_at'] = date('Y-m-d H:i:s');
			$data['id'] = DB::table('word')->insertGetId($data);
		}
		$response['word'] = $data;
		$response['status'] = 1;
		return $response;
	}
	public function updateWord() {
		date_default_timezone_set('PRC');
		$data['name'] = Request::input('name');
		$data['meaning'] = Request::input('meaning');
		$data['example'] = trim(Request::input('example'));
		$data['variant'] = Request::input('variant');
		$data['origin'] = Request::input('origin');
		$data['pronun'] = Request::input('pronun');
		$data['category'] = Request::input('category');
		$data['family'] = Request::input('family');
		$data['lettertype'] = Request::input('lettertype');
		$data['count'] = count(preg_split('/\n/',$data['example']));
		$id = Request::input('id');
		$data['updated_at'] = date('Y-m-d H:i:s');
		DB::table('word')->where('id',$id)->update($data);

		$response['status'] = 1;
		return $response;
	}
	public function addCategory() {
		date_default_timezone_set('PRC');
		$data['name'] = Request::input('category');
		$data['created_at'] = date('Y-m-d H:i:s');
		$data['updated_at'] = date('Y-m-d H:i:s');
		$data['id'] = DB::table('category')->insertGetId($data);
		$response['status'] = 1;
		$response['category'] = $data;
		return $response;
	}
	public function getWordById() {
		date_default_timezone_set('PRC');
		$id = Request::input('id');
		$word = DB::table('word')->where('id',$id)->first();
		DB::table('word')->where('id',$id)->update(['viewed_at' => date('Y-m-d')]);
		$response['status'] = 1;
		$response['word'] = $word;
		return $response;
	}
	public function getWordByCategaryAndName() {
		
	}
	/*
	public function index($type) {
		$charactertypes = DB::table('charactertype')->get();
		if(!session('charactertype')) {
			$characterype = 1;
			session(['charactertype' => 1]);
		}
		$charactertype = DB::table('charactertype')->where('id',session('charactertype'))->first();
		Session::put('type',$type);

		$characters = DB::table('_character')
			->where('charactertypeId',session('charactertype'))
			->orderBy('name')
			->paginate(10);

		return view('character',['charactertypes' => $charactertypes,'charactertype' => $charactertype,'characters' => $characters]);
	}
	*/
	public function changecharactertype() {
		$type = Input::get('type');
		session(['charactertype' => $type]);

		$response['status'] = 1;
		return $response;
	}

	public function getCharacters() {
		$characters = null;
		if(session('type') != 'add') {
			$characters = DB::table('_character')
				->where('charactertypeId',session('charactertype'))
				->orderBy('name')
				->get();
		}
		$response['characters'] = $characters;
		$response['status'] = 1;
		return $response;
	}

	public function splitArticle() {
		$characters = Request::input('characters');
		$characters = json_decode($characters);
		$unkown_characters = array();
		//$characters = ['enumerate'];
		$type = DB::table('charactertype')->where('name','Common')->first();
		$ignore = DB::table('charactertype')->where('name','Ignore')->first();
		//echo "<html>";
		$character_info = array();
		foreach($characters as $character) {
			$results = DB::table('_character')
				->where('name',$character)
				->orWhere('pt','=',$character)
				->orWhere('pap','=',$character)
				->orWhere('prp','=',$character)
				->orWhere('pl','=',$character)
				->orWhere('tps','=',$character)
				->orWhere('cd','=',$character)
				->orWhere('super','=',$character)
				->get();
			//var_dump($results);
			if(!$results) {
				array_push($unkown_characters, $character);
			}
			else if(session('charactertype') != $type->id && session('charactertype') != $ignore->id) {
				$isAdd = false;
				foreach($results as $i => $result) {
					if($result->charactertypeId == session('charactertype')) {
						$isAdd = true;
						$character_info[$character] = $result;
					}
					else if($result->charactertypeId != $type->id && $result->charactertypeId != $ignore->id) {
						$isAdd = true;
					}
				}
				if($isAdd)
					array_push($unkown_characters, $character);
			}
		}
		$response = [
			'characters' => $unkown_characters,
			'character_info' => $character_info,
			'status' => 1,
			'charactertype' => session('charactertype')
		];
		//echo "</html>";
		return $response;
	}

	public function addCharacter() {
		$data['name'] = Request::input('name');
		$data['mean'] = Request::input('mean');
		$data['example'] = Request::input('example');
		$data['pt'] = Request::input('pt');
		$data['pap'] = Request::input('pap');
		$data['prp'] = Request::input('prp');
		$data['pl'] = Request::input('pl');
		$data['tps'] = Request::input('tps');
		$data['count'] = Request::input('count');
		$data['cd'] = Request::input('cd');
		$data['super'] = Request::input('super');
		$data['lettertype'] = Request::input('lettertype');
		if(!session('charactertype')) {
			$response['status'] = 0;
			$response['msg'] = 'type';
			return $response;
		}
		$data['charactertypeId'] = session('charactertype');
		$character = DB::table('_character')->where('name',$data['name'])->where('charactertypeId',session('charactertype'))->first();
		if($character) {
			$data['mean'] = ($character->mean).$data['mean'];
			$data['example'] = ($character->example).$data['example'];
			DB::table('_character')->where('name',$data['name'])->where('charactertypeId',session('charactertype'))->update($data);
		}
		else {
			$data['createtime'] = date('Y-m-d');
			DB::table('_character')->insert($data);
		}
		$response['status'] = 1;
		return $response;
	}

	public function getCharacterById() {
		$id = Request::input('id');

		$character = DB::table('_character')->where('id',$id)->first();
		$response['character'] = $character;
		$response['status'] = 1;

		return $response;
	}

	public function updateCharacter() {
		$data['pt'] = Request::input('pt');
		$data['pap'] = Request::input('pap');
		$data['prp'] = Request::input('prp');
		$data['pl'] = Request::input('pl');
		$data['tps'] = Request::input('tps');
		$data['cd'] = Request::input('cd');
		$data['super'] = Request::input('super');
		$data['example'] = Request::input('example');
		$data['mean'] = Request::input('mean');
		$data['lettertype'] = Request::input('lettertype');
		$data['count'] = Request::input('count');
		$id = Request::input('id');

		DB::table('_character')->where('id',$id)->update($data);

		$response['status'] = 1;
		return $response;
	}
	public function doSomething() {

		DB::table('word')->where('category','GONE WITH THE WIND')->update(['state' => 1]);
		return;
		$words = DB::table('word')
			->get();
		foreach ($words as $i => $word) {
			$category = trim($word->category);
			DB::table('word')->where('id',$word->id)->update(['category' => $category]);
		}
		return;

		DB::table('word')->where('category','DIVERGENT')->delete();
		$words = DB::table('word')
			->where('category','GAME')
			->where('state',1)
			//->where('name','gallantry')
			->orderBy('count','desc')
			->get();
		$max = count($words);
		$wordMap = array();
		foreach ($words as $i => $word) {
			$origin = $word->origin;
			if(empty($wordMap[$origin])) {
				$wordMap[$origin] = array();
				$wordMap[$origin]['count'] = 1;
				$wordMap[$origin]['words'] = array();
			}
			$wordMap[$origin]['count'] += $word->count;
			$wordMap[$origin]['count']--;
			array_push($wordMap[$origin]['words'],$word->name);
			//array_push($wordMap[$origin]['words'],$word->id);
			/*
			$example = trim($word->example);
			$examples = preg_split('/\n/',$example);
			$count = count($examples);
			DB::table('word')->where('id',$word->id)->update(['count' => $count]);
			*/
		}
		rsort($wordMap);
		var_dump($wordMap);
		$i = 0;
		foreach ($wordMap as $name => $wordInfo) {
			$i++;
			if($i <= $max * 0.1) {
				//var_dump($wordMap[$name]);
				foreach($wordMap[$name]['words'] as $id) {
					//DB::table('word')->where('id',$id)->update(['state' => 1]);
				}
			}
			else {
				foreach($wordMap[$name]['words'] as $id) {
					//DB::table('word')->where('id',$id)->update(['state' => 0]);
				}
			}
		}
		//var_dump($wordMap);		
	}
}