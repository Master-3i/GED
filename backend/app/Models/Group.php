<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class Group extends Model
{
    use HasFactory;


    public function group_owner()
    {
        return $this->belongsTo(User::class);
    }

    protected $fillable = [
        'group_name',
        'group_users'
    ];

    protected $connection = "mongodb";
}
