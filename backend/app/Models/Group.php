<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    public function users(){
        return $this->hasMany(User::class);
    }

    public function group_owner(){
        return $this->belongsTo(User::class);
    }

    protected $fillable = [
        'group_name',
    ];

    protected $connection = "mongodb";
}
