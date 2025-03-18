<?php

defined('BASEPATH') or exit('No direct script access allowed');

class PreviousRecordModel extends CI_Model
{

	public $table = 'previous_record';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$query = $this->db
			->order_by('model')
			->get($this->table);
		return $query->result();

	} 

}
