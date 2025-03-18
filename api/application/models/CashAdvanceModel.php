<?php

defined('BASEPATH') or exit('No direct script access allowed');

class CashAdvanceModel extends CI_Model
{

	public $table = 'cash_advance';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$query = $this->db
			->order_by('date_added', 'DESC')
			->get($this->table);
		return $query->result();

	}

	public function get_total()
	{
		 
		
		$query = $this->db
			->select('sum(amount) as total_amount')
			// ->where('amount', 1)
			->get($this->table); 

		return $query->row();

	}

	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}

	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}

	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}


}
