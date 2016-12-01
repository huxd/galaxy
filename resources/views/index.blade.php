<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8">
	<title>Poppy</title>
	<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0" />
	<!--<link rel="stylesheet" type="text/css" href="{{config('app.baseUrl')}}/css/bootstrap.min.css" />
	<link rel="stylesheet" type="text/css" href="{{config('app.baseUrl')}}/css/project/character.css" />-->
	<style type="text/css">
		body,button, input, select, textarea,h1 ,h2, h3, h4, h5, h6,table,tr,td,p,label,div { 
			font-family:Tahoma,Arial, "\5b8b\4f53", sans-serif;
		}
		body {
			background-color: #f1f1f1;
		}
		@font-face {
			font-family:"Alako";
			src:url("{{config('app.baseUrl')}}/fonts/Damion-Regular.ttf") format("truetype")
		}
		table {
			table-layout:fixed;
		}
		.description {
			white-space: pre-wrap;
		}
	</style>
	@yield('css')
</head>
<body>
	<nav class="navbar navbar-default">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
			        <span class="sr-only">Toggle navigation</span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
				</button>
			</div>

			<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				<ul class="nav navbar-nav">
					<li id='Word'><a href="{{config('app.baseUrl')}}/index.php/word/wordIndex">Word</a></li>
					<li id='Phrase'><a href="{{config('app.baseUrl')}}/index.php/phrase/phraseIndex">Phrase</a></li>
					<li id='similarity'><a href="{{config('app.baseUrl')}}/index.php/similarity/index">Similarity</a></li>
					<li class='dropdown'>
						<a href="#" class="dropdown-toggle" data-toggle="dropdown">Character<span class="caret"></span>
						<ul class="dropdown-menu" role="menu">
				            <li><a href="{{config('app.baseUrl')}}/index.php/character/index/add">AddCharacter</a></li>
				            <li><a href="{{config('app.baseUrl')}}/index.php/character/index/view">ViewCharacter</a></li>
				        </ul>
					</li>
				</ul>
			</div>
		</div>
	</nav>
	<div class='container'>
		@yield('content')
	</div>
</body>
	@yield('script')
</html>
