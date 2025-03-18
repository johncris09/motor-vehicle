<?php

defined('BASEPATH') or exit('No direct script access allowed');

class ClaimModel extends CI_Model
{

	public $table = 'claim';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$query = $this->db
			->select('
				claim.id,
				claim.control_number,
				claim.app_year,
				claim.app_month,
				claim.amount,
				claim.purpose,
				claim.claim_date,
				claim.date_encoded,
				claim.purok,
				claimant.id claimant_id,
				claimant.first_name claimant_first_name,
				claimant.middle_name claimant_middle_name,
				claimant.last_name claimant_last_name,
				claimant.suffix claimant_suffix, 
				claimant.birthdate claimant_birthdate, 
				claimant.gender claimant_gender, 
				claimant.marital_status claimant_marital_status, 
				patient.id patient_id,
				patient.first_name patient_first_name,
				patient.middle_name patient_middle_name,
				patient.last_name patient_last_name,
				patient.suffix patient_suffix, 
				barangay.id barangay_id, 
				barangay.barangay, 
				financial_assistance_type.id financial_assistance_type_id,
				financial_assistance_type.type financial_assistance_type,
				financial_assistance_type.description financial_assistance_description,
				users.id users_id,
				users.first_name users_first_name,
				users.middle_name users_middle_name,
				users.last_name users_last_name
			
			')
			->from($this->table)
			->join('claimant', 'claim.claimant_id = claimant.id', 'LEFT')
			->join('patient', 'claim.patient_id = patient.id', 'LEFT')
			->join('barangay', 'claim.barangay_id = barangay.id', 'LEFT')
			->join('financial_assistance_type', 'claim.financial_assistance_type_id = financial_assistance_type.id', 'LEFT')
			->join('users', 'claim.encoded_by = users.id', 'LEFT')
			->order_by('control_number desc')
			->get();
		return $query->result();


	}

	// Total Amount of Claim

	public function get_total()
	{
		$query = $this->db
			->select('sum(amount) as total_amount')
			->get($this->table); 

		return $query->row();
 

	}


	public function total_amount_by_type($financial_assistance_type)
	{


		$this->db->select('sum(amount) as total_amount  ')
			->where('financial_assistance_type_id', $financial_assistance_type);
		$query = $this->db->get($this->table);
		return $query->row()->total_amount;


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
	public function get_claimant_latest_transaction($id)
	{

		$query = $this->db->select('*')
			->from('claim')
			->where('claimant_id', $id)
			->order_by('claim_date', 'desc')
			->limit(1)
			->get();


		return $query->row();

	}
	public function get_patient_latest_transaction($id)
	{

		$query = $this->db->select('*')
			->from('claim')
			->where('patient_id', $id)
			->order_by('claim_date', 'desc')
			->limit(1)
			->get();


		return $query->row();

	}

	public function get_latest_transaction($data, $months = 3)
	{
		
		$query = $this->db
			->select('*')
			->where('claim_date >= DATE_SUB(CURDATE(), INTERVAL '.$months.' MONTH)')
			->where($data)
			->limit(1)
			->get('claim');


		return $query->num_rows();
	}

	public function total()
	{
		$query = $this->db
			->get($this->table);
		
		return $query->num_rows() + 1;
	}
}
