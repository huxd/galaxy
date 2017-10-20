<?php
Route::get('/', 'WordController@index');
Route::get('/add', 'WordController@index');
Route::get('/update', 'WordController@index');

Route::get('/getWordsAll', 'WordController@getWordsAll');
Route::any('/addWord', 'WordController@addWord');
Route::any('/updateWord', 'WordController@updateWord');
Route::any('/addCategory', 'WordController@addCategory');
Route::any('/getWordById', 'WordController@getWordById');
Route::any('/show','WordController@show');
Route::any('/doSomething','WordController@doSomething');

Route::any('/study','StudyController@index');

Route::post('word/getwords','WordController@getwords');
Route::post('word/changewordtype','WordController@changewordtype');
Route::post('word/saveword','WordController@saveword');
Route::post('word/queryWord','WordController@queryWord');
Route::get('word/wordIndex','WordController@wordindex');
//Route::get('/','WordController@wordindex');

Route::get('/read','ReadController@index');

Route::get('/phrase/phraseIndex','PhraseController@phraseIndex');
Route::get('/phrase/{type}','PhraseController@phrase');
Route::post('/phrase/changephrasetype','PhraseController@changephrasetype');
Route::post('/phrase/savePhrase','PhraseController@savePhrase');
Route::post('/phrase/delete','PhraseController@delete');
Route::post('/phrase/update','PhraseController@update');

Route::get('/similarity/index','SimilarityController@index');
Route::get('/similarity/{type}','SimilarityController@similarity');
Route::post('/similarity/getTags','SimilarityController@getTags');
Route::post('/similarity/getSimilarity','SimilarityController@getSimilarity');
Route::post('/similarity/addTag','SimilarityController@addTag');
Route::post('/similarity/addSimilarity','SimilarityController@addSimilarity');
Route::post('/similarity/deleteSimilarity','SimilarityController@deleteSimilarity');
Route::post('/similarity/deleteTag','SimilarityController@deleteTag');
Route::post('/similarity/changeType','SimilarityController@changeType');

Route::get('/character/index/{type}','CharacterController@index');
Route::post('/character/changecharactertype','characterController@changecharactertype');
Route::post('/character/getCharacterById','characterController@getCharacterById');
Route::get('/character/getCharacters','characterController@getCharacters');
Route::any('/character/splitArticle','characterController@splitArticle');
Route::post('/character/addCharacter','characterController@addCharacter');
Route::post('/character/updateCharacter','characterController@updateCharacter');
