<?php

namespace App\Http\Controllers;

use DB;
use Input;
use Request;
use Session;
use App\Http\Controllers\Controller;

class CharacterController extends Controller {
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
		/*
		$characters = DB::table('_character')
			->where('charactertypeId',2)
			->orderBy('count','desc')
			->get();
		foreach ($characters as $i => $character) {
			$examples = preg_split('/\n/',$character->example);
			foreach($examples as $example) {
				$example = str_replace('Mr.','Mr,',$example);
				$example = str_replace('Mrs.','Mrs,',$example);
				$example = str_replace('St.','St,',$example);
				$example = str_replace('."',',"',$example);
				$example = str_replace('.(1)','',$example);
				$example = str_replace('.(2)','',$example);
				$example = str_replace('.(3)','',$example);
				$example = str_replace('.(4)','',$example);
				$example = trim($example," \t\n\r\0\x0B.");
				if(stripos($example,'.') !== false) {
					//echo $example;
					var_dump($character->name);
					var_dump($example);
					break;
				}
			}
		}
		*/
		/*
		$characters = DB::table('_character')->where('charactertypeId',2)->orderBy('count','desc')->get();
		$num = (int)(count($characters) * 0.1);
		for($i = 0; $i <= $num; $i++) {
			//var_dump($characters[$i]->name);
			DB::table('_character')->where('id',$characters[$i]->id)->update(['state' => 1]);
		}
		*/
		/*
		foreach ($characters as $i => $character) {
			$examples = preg_split('/\n/',$character->example);
			$count = count($examples);
			if(!$examples[$count - 1])
				$count--;
			DB::table('_character')->where('id',$character->id)->update(['count' => $count]);
		}
		*/
	}
}