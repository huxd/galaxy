<?php

namespace App\Http\Controllers;

use DB;
use Input;
use Request;
use Session;
use App\Http\Controllers\Controller;

class StudyController extends Controller {
	public function index() {
		return view('study');
	}
}