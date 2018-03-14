<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8">
	<title>Poppy</title>
	<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0" />
	<!--<link rel="stylesheet" type="text/css" href="{{config('app.baseUrl')}}/css/vendor/bootstrap.min.css" />-->
	<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<link rel="stylesheet" type="text/css" href="{{config('app.baseUrl')}}/css/base.css" />
	@yield('css')
</head>
<body>
	<nav class="navbar navbar-default navbar-fixed-top">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
					<span class="sr-only">Toggle navigation</span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
				</button>
			</div>

			<div class="collapse navbar-collapse">
				<ul class="nav navbar-nav">
					<li id='word'><a href="{{config('app.baseUrl')}}/index.php">WORD</a></li>
					<li id='study'><a href="{{config('app.baseUrl')}}/index.php/study">STUDY</a></li>
					<li id='read'><a href="{{config('app.baseUrl')}}/index.php/read">READ</a></li>
					<!--
						<li id='Phrase'><a href="{{config('app.baseUrl')}}/index.php/phrase/phraseIndex">Phrase</a></li>
						<li id='similarity'><a href="{{config('app.baseUrl')}}/index.php/similarity/index">Similarity</a></li>
					-->
				</ul>
			</div>
		</div>
	</nav>
	<div class='container'>
		@yield('content')
	</div>
</body>
	<script type="text/javascript" src="{{config('app.baseUrl')}}/js/vendor/jquery.min.js"></script>
	<script type="text/javascript" src="{{config('app.baseUrl')}}/js/vendor/bootstrap.min.js"></script>
	<script type="text/javascript" src="{{config('app.baseUrl')}}/js/base.js"></script>
	@yield('script')
</html>
