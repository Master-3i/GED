<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class Pack extends Model
{
    use HasFactory;


    protected $fillable = [
        'package_name',
        'storage_limit',
        'group_limit',
        'group_storage_limit'
    ];


    protected $connection = "mongodb";
}
