@extends('base')

@section('css')
	<link rel="stylesheet" type="text/css" href="{{config('app.baseUrl')}}/css/study.css">
@endsection

@section('content')
	<div id='root'></div>
@endsection

@section('script')
	<script type="text/javascript">
		$('li#study').addClass('active');
	</script>
	<script type="text/javascript" src="{{config('app.baseUrl')}}/js/vendor/jquery.cookie.js"></script>
	<script type="text/javascript" src="{{config('app.baseUrl')}}/js/study.js"></script>
@endsection