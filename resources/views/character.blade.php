@extends('index')
@section('content')
	<div class="modal fade" id="characterModal" tabindex="-1" role="dialog" 
	   aria-labelledby="myModalLabel" aria-hidden="true">
	   <div class="modal-dialog">
		  <div class="modal-content">
			 <div class="modal-header">
				<button type="button" class="close" 
				   data-dismiss="modal" aria-hidden="true">
					  &times;
				</button>
				<h4 class="modal-title" id="myModalLabel">
					Hello!
				</h4>
			 </div>
			 <div class="modal-body" >
				<form class='clearfix'>
					<div class='form-group col-md-5'>
						<select id="charactertype" class="form-control">
							@foreach($charactertypes as $charactertyp)
								@if($charactertyp->id == $charactertype->id)
								<option value="{{$charactertyp->id}}" selected="selected">{{$charactertyp->name}}</option>
								@else
								<option value="{{$charactertyp->id}}">{{$charactertyp->name}}</option>
								@endif
							@endforeach
						</select>
					</div>
				</form>
			 </div>
			 <div class="modal-footer">
				<button type="button" class="btn btn-default" 
				   data-dismiss="modal">关闭
				</button>
				<button type="button" class="btn btn-primary" onclick="changetype()" data-dismiss="modal">
				   确定
				</button>
			 </div>
		  </div>
		</div>
	</div>
	<div class="modal fade" id="show_character_modal" tabindex="-1" role="dialog" 
	   aria-labelledby="myModalLabel" aria-hidden="true">
	   <div class="modal-dialog modal-lg">
		  <div class="modal-content">
			 <div class="modal-header clearfix">
				<button type="button" class="close" 
				   data-dismiss="modal" aria-hidden="true">
					  &times;
				</button>
			 </div>
			 <div class="modal-body" >
				<div class='name-area'><span id='name'></span></div>
				<div class='type-area' id="type_area">
					<div class='tag tag-disable' item-name='prep'>prep</div>
					<div class='tag tag-disable' item-name='adj'>adj</div>
					<div class='tag tag-disable' item-name='adv'>adv</div>
					<div class='tag tag-disable' item-name='conj'>conj</div>
					<div class='tag tag-disable' item-name='n'>n</div>
					<div class='tag tag-disable' item-name='v'>v</div>
				</div>
				<div class='count-area'><b>Duplication : </b><span id='count'>0</span></div>
				<div id='oldinfo_area'>
					<div><b>Meaning:</b></div>
					<div><span id='mean'></span></div>
					<div><b>Example:</b></div>
					<div><span id='example'></span></div>
				</div>
				@if(session('type') == 'add')
				<div id='newinfo_area'>
					<div><b>Meaning:</b></div>
					<div><span id='v_mean'>none</span></div>
					<div><b>Example:</b></div>
					<div><span id='v_example'>none</span></div>
				</div>
				@endif
				<table class='table' id='character_table'>
					<tr><th>past tense</th><th>past participle</th><th>present participle</th><th>plural</th><th>third person singular</th><th>comparative degree</th><th>superlative</th></tr>
					<tr><td><span id='pt'>nope</span></td><td><span id='pap'>nope</span></td><td><span id='prp'>nope</span></td><td><span id='pl'>nope</span></td><td><span id='tps'>nope</span></td><td><span id='cd'>nope</span></td><td><span id='super'>nope</span></td></tr>
				</table>
				<input type="hidden" id='characterid'>
			 </div>
			 <div class="modal-footer">
			 	<!--
				<button type="button" class="btn btn-default" 
				   data-dismiss="modal">关闭
				</button>
				-->

				@if(session('type') == 'add')
				<button type='button' class='btn btn-info' id='add_character_btn'>add</button>
				@elseif(session('type') == 'view')
				<button type='button' class='btn btn-danger pull-left' id='delete_character_btn'>delete</button>
				<button type='button' class='btn btn-info' id='update_character_btn'>update</button>
				@endif
			 </div>
		  </div>
		</div>
	</div>
	<div class='important-panel'></div>
	<div class='panel panel-info' id='show_panel'>
		<div class='panel-heading clearfix'>
			@if($charactertype)
				<b style='font-size:1.5em'>{{$charactertype->name}}</b>
			@endif
			<span class='character-count'></span>
			<button onclick="viewCharacterModal()" type="button" class='btn btn-info btn-sm pull-right'>ChangeType</button>
		</div>
		<div class='panel-body'>
			@if(session('type') == 'add')
			<div class='article-area'>
				<textarea class='form-control' id='article'></textarea>
				<button class='btn btn-info btn-sm' id='split_article_btn'>SplitArticle</button>
			</div>
			@endif
			<!--
			<div class='panel panel-default character-panel'>
				<div class='panel-heading'>
					A
				</div>
				<div class='panel-body'>
					<div class='tag tag-active' item-id='1'>who <span>|</span> 2</div>
				</div>
			</div>
			-->
		</div>
	</div>

	<script type="text/javascript">
		$('#character').attr('class','active');
	</script>
	<script type="text/javascript" src="{{config('app.baseUrl')}}/js/project/character.js"></script>
@endsection