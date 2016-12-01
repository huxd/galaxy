<?php

namespace App\Http\Controllers;

use DB;
use App\Http\Controllers\Controller;

class AdminController extends Controller {
	public function createDB() {
		$host = env('DB_HOST');
		$name = env('DB_DATABASE');
		$username = env('DB_USERNAME');
		$password = env('DB_PASSWORD');

		$mysql = @new \mysqli($host,$username,$password);
		
		//$mysql->query("create database $name default character set utf8");
		$mysql = @new \mysqli("localhost",$username,$password,$name);
		DB::statement('"create table category(
			id int(11) not null auto_increment,
			name varchar(30),
			primary key(id)
		)"');

		$check = array();
		$check['category'] = $mysql->query("create table category(
			id int(11) not null auto_increment,
			name varchar(30),
			primary key(id)
		)");

		$check['category'] = $mysql->query("create table word(
			id int(11) not null auto_increment,
			name varchar(30),
			primary key(id)
		)");
		/*
		$check['wordtype'] = $mysql->query("CREATE table wordtype(
			id int(11) not null AUTO_INCREMENT,
			name varchar(30),
			primary key (id)
		)");

		$check['word'] = $mysql->query("CREATE table word(
			id int(11) not null AUTO_INCREMENT,
			wordtypeId int(11) not null,
			name varchar(30),
			time datetime,
			rate int(2),
			foreign key (wordtypeId) references wordtype (id),
			primary key (id)
		)");

		$check['phrasetype'] = $mysql->query("CREATE table phrasetype(
			id int(11) not null AUTO_INCREMENT,
			name varchar(30),
			primary key (id)
		)");

		$check['phrase'] = $mysql->query("CREATE table phrase(
			id int(11) not null AUTO_INCREMENT,
			phrasetypeId int(11) not null,
			name varchar(30),
			time datetime,
			mean text,
			example text,
			foreign key (phrasetypeId) references phrasetype (id),
			primary key (id)
		)");

		$check['similaritytag'] = $mysql->query("CREATE table similaritytag(
			id int(11) not null AUTO_INCREMENT,
			typeId int(11) not null default 1,
			name varchar(30),
			foreign key(typeId) references similaritytype (id) on delete cascade,
			primary key (id)
		)");

		$check['similarity'] = $mysql->query("CREATE table similarity(
			id int(11) not null AUTO_INCREMENT,
			tagId int(11) not null,
			name varchar(30),
			mean text,
			foreign key(tagId) references similaritytag (id) on delete cascade,
			primary key(id)
		)");

		$check['similaritytype'] = $mysql->query("CREATE table similaritytype(
			id int(11) not null AUTO_INCREMENT,
			name varchar(30),
			primary key (id)
		)");
		*/
		foreach ($check as $key => $value) {
			if($value)
				echo "<p style='color:green;'>create table $key success!</p>";
			else
				echo "<p style='color:red;'>create table $key fail!</p>";
		}
	}
}