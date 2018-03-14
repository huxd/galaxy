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

        $meanings = DB::table('meaning')
                    ->join('category', 'meaning.category_id', '=', 'category.id')
                    ->select('meaning.id', 'word_id', 'category_id', 'category.name as category')
                    ->get();


        $response['words'] = $words;
        $response['categorys'] = $categorys;
        $response['meanings'] = $meanings;
        $response['cocaWords'] = DB::table('coca')->get();
        return $response;
    }
    public function addWord() {
        date_default_timezone_set('PRC');
        $data['name'] = Request::input('name');
        $data['meaning'] = ' ';
        $data['example'] = ' ';
        $data['variant'] = Request::input('variant');
        $data['origin'] = Request::input('origin');
        $data['category'] = Request::input('category');
        $data['lettertype'] = Request::input('lettertype');
        $data['pronun'] = Request::input('pronun');
        $data['family'] = Request::input('family');
        $word = DB::table('word')->where('name',$data['name'])->where('category',$data['category'])->first();
        $data['count'] = count(preg_split('/\n/',$data['example']));
        if($word) {
            $data['meaning'] = trim(($word->meaning).$data['meaning']);
            if(!trim($word->example))
                $data['example'] = trim($data['example']);
            else
                $data['example'] = trim($word->example)."\n".trim($data['example']);
            $data['count'] += $word->count;
            $data['id'] = $word->id;
            DB::table('word')->where('name',$data['name'])->where('category',$data['category'])->update(['example' => $data['example'],'count' => $data['count']]);
        }
        else {
            $data['created_at'] = date('Y-m-d H:i:s');
            $data['updated_at'] = date('Y-m-d H:i:s');
            $data['id'] = DB::table('word')->insertGetId($data);
        }
        $response['word'] = $data;

        /*添加meaning相关*/
        $meanings =  json_decode(Request::input('meanings'));
        $category_id = DB::table('category')
                        ->where('name', $data['category'])
                        ->value('id');
        foreach($meanings as $meaning) {
            $data = array();
            $data['entity'] = $meaning->meaning;
            $data['example'] = $meaning->example;
            $data['word_id'] = $response['word']['id'];
            $data['category_id'] = $category_id;
            $data['created_at'] = date('Y-m-d H:i:s');
            $data['updated_at'] = date('Y-m-d H:i:s');
            DB::table('meaning')->insert($data);
        }
        $response['status'] = 1;
        return $response;
    }
    public function getArticle() {
        $article = DB::table('article')->first();
        $response['article'] = $article;
        $response['status'] = 1;
        return $response;
    }
    public function updateWord() {
        date_default_timezone_set('PRC');
        $data['name'] = Request::input('name');
        //$data['meaning'] = Request::input('meaning');
        //$data['example'] = trim(Request::input('example'));
        $data['variant'] = Request::input('variant');
        $data['origin'] = Request::input('origin');
        $data['pronun'] = Request::input('pronun');
        //$data['category'] = Request::input('category');
        $data['family'] = Request::input('family');
        $data['lettertype'] = Request::input('lettertype');
        $id = Request::input('id');
        $data['updated_at'] = date('Y-m-d H:i:s');
        DB::table('word')->where('id', $id)->update($data);


        /*添加meaning相关*/
        $meanings =  json_decode(Request::input('meanings'));
        
        foreach($meanings as $meaning) {
            $category_id = DB::table('category')
                        ->where('name', $meaning->category)
                        ->value('id');
            $data = array();
            $data['entity'] = $meaning->meaning;
            $data['example'] = $meaning->example;
            $data['word_id'] = $id;
            $data['category_id'] = $category_id;
            if($meaning->state == 'add') {
                $data['created_at'] = date('Y-m-d H:i:s');
                $data['updated_at'] = date('Y-m-d H:i:s');
                DB::table('meaning')->insert($data);
            } else if($meaning->state == 'update') {
                DB::table('meaning')->where('id', $meaning->id)
                                    ->update($data);
            } else if($meaning->state == 'delete') {
                //DB::table('meaning')->where('id', $meaning->id)
                //                    ->delete();
            }
        }

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
        $meanings = DB::table('meaning')
                    ->join('category', 'category.id', '=', 'meaning.category_id')
                    ->where('word_id', $id)
                    ->select('meaning.id', 'category_id', 'entity as meaning', 'example', 'category.name as category')
                    ->get();
        DB::table('word')->where('id',$id)->update(['viewed_at' => date('Y-m-d')]);
        $response['status'] = 1;
        $response['word'] = $word;
        $response['meanings'] = $meanings;
        return $response;
    }
    public function getWordByCategaryAndName() {
        
    }
    public function doSomething() {
        date_default_timezone_set('PRC');
        /*
        $file = fopen("coca20000.txt", "r");
        while(!feof($file)) {
            $word = explode(" ", fgets($file));
            $data['name'] = $word[1];
            $data['rank'] = $word[0];
            //DB::table('coca')->insert($data);
        }
        return;
        */
        /*
        //迁移释义到meanning表
        $words = DB::table('word')
                ->join('category', 'category.name', '=', 'word.category')
                //->where('word.id',5165)
                ->select('word.example','word.meaning','word.id','category.id as category_id')
                ->get();
        foreach($words as $word) {
            if(!trim($word->meaning)) {
                continue;
            }
            $meanings = explode("\n", trim($word->meaning));
            $examples = explode("\n", trim($word->example));
            $t = 0;
            foreach($meanings as $i => $meaning) {
                $example = "";
                if($i == 0) {
                    while($t < count($examples) && !preg_match("/.*\\(2\\)/", $examples[$t])) {
                        $example = $example.$examples[$t]."\n";
                        $t++;
                    }
                } else {
                    while($t < count($examples) && preg_match("/.*\\(".($i + 1)."\\)/", $examples[$t])) {
                        $examples[$t] = preg_replace("/\\(".($i + 1)."\\)/", '', $examples[$t]);
                        $example = $example.$examples[$t]."\n";
                        $t++;
                    }
                }
                $data = array();
                $data['word_id'] = $word->id;
                $data['category_id'] = $word->category_id;
                $data['entity'] = $meaning;
                $data['example'] = $example;
                $data['created_at'] = date('Y-m-d H:i:s');
                $data['updated_at'] = date('Y-m-d H:i:s');
                DB::table('meaning')->insert($data);
                //var_dump($data);
            }
        }
        */
        //DB::table('word')->where('category', 'DAVID COPPERFIELD')->update(['state' => 1]);
        
        $words = DB::table('word')->where('category', 'WUTHERING HEIGHTS')->get();
        foreach ($words as $i => $word) {
            $meaning = DB::table('meaning')->where('word_id', $word->id)->first();
            if($meaning == null) {
                var_dump($word);
                $data['entity'] = "";
                $data['example'] = "";
                $data['word_id'] = $word->id;
                $data['category_id'] = 13;
                $data['created_at'] = date('Y-m-d H:i:s');
                $data['updated_at'] = date('Y-m-d H:i:s');
                //DB::table('meaning')->insert($data);
            }
        }
        DB::table('word')->where('category','MAJOR')->delete();
        return;

        DB::table('word')->where('category','MAJOR')->delete();
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