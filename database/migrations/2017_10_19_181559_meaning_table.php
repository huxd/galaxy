<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MeaningTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /*
        Schema::create('meaning', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('word_id');
            $table->unsignedInteger('category_id');
            $table->string('entity', 512);
            $table->text('example');
            $table->timestamps();
        });
        */
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //Schema::dropIfExists('meaning');
    }
}
