@extends('index')

@section('css')
	<link rel="stylesheet" type="text/css" href="{{config('app.baseUrl')}}/css/a.css">
@endsection

@section('content')
	<div id='root'>
		
	</div>
	<button>点我</button>
	<script type="text/javascript" src="{{config('app.baseUrl')}}/js/vendor/jquery.min.js"></script>
	<script type="text/javascript" src="{{config('app.baseUrl')}}/js/a.js"></script>
@endsection