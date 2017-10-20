<?php

namespace App\Http\Controllers;

use DB;
use Input;
use Request;
use Session;
use App\Http\Controllers\Controller;

class ReadController extends Controller {
	public function index() {
		return view('read');
	}
}