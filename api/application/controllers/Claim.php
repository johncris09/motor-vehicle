<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class claim extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('claimModel');

	}

	public function index_get()
	{
		$claimModel = new claimModel;
		$claims = $claimModel->get();
		$data = [];
		foreach ($claims as $claim) {
			$data[] = array(
				"id" => $claim->id,
				"control_number" => $claim->control_number,
				"app_year" => $claim->app_year,
				"app_month" => $claim->app_month,
				"amount" => $claim->amount,
				"formatted_amount" => number_format($claim->amount, 2),
				"purpose" => $claim->purpose,
				"claim_date" => $claim->claim_date,
				"date_encoded" => $claim->date_encoded,
				"purok" => $claim->purok,
				"claimant_id" => $claim->claimant_id,
				"claimant_first_name" => $claim->claimant_first_name,
				"claimant_middle_name" => $claim->claimant_middle_name,
				"claimant_last_name" => $claim->claimant_last_name,
				"claimant_suffix" => $claim->claimant_suffix,
				"claimant_gender" => $claim->claimant_gender,
				"claimant_marital_status" => $claim->claimant_marital_status,
				"claimant_birthdate" => $claim->claimant_birthdate,
				"claimant_age" => $this->calculateAge($claim->claimant_birthdate),
				"patient_id" => $claim->patient_id,
				"patient_first_name" => $claim->patient_first_name,
				"patient_middle_name" => $claim->patient_middle_name,
				"patient_last_name" => $claim->patient_last_name,
				"patient_suffix" => $claim->patient_suffix,
				"barangay_id" => $claim->barangay_id,
				"barangay" => $claim->barangay,
				"financial_assistance_type_id" => $claim->financial_assistance_type_id,
				"financial_assistance_type" => $claim->financial_assistance_type,
				"financial_assistance_description" => $claim->financial_assistance_description,
				"users_id" => $claim->users_id,
				"users_first_name" => $claim->users_first_name,
				"users_middle_name" => $claim->users_middle_name,
				"users_last_name" => $claim->users_last_name
			);
		}
		$this->response($data, RestController::HTTP_OK);
	}

	private function calculateAge($birthDate)
	{
		if ($birthDate === null) {
			return 'Invalid date provided';
		}
		$birthDate = new DateTime($birthDate);
		$currentDate = new DateTime();
		$age = $currentDate->diff($birthDate);
		return $age->y;
	}


	public function total_get()
	{

		$claimModel = new claimModel;
		$result = $claimModel->total();
		$this->response($result, RestController::HTTP_OK);

	}



	public function find_get($id)
	{

		$claimModel = new claimModel;
		$result = $claimModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}

	public function get_claimant_latest_transaction_get($id)
	{
		$claimModel = new claimModel;
		$result = $claimModel->get_claimant_latest_transaction($id);
		$data = [];
		if ($result) {
			if ($this->isWithinThreeMonths($result->claim_date)) {
				$data = array(
					'latest_transaction' => $result->claim_date,
					'message' => "Latest Transaction is within the last 3 months.",
				);
			} else {
				$data = array(
					'latest_transaction' => $result->claim_date,
					'message' => "Latest Transaction is not within the last 3 months.",
				);
			}

		} else {
			$data = array(
				'latest_transaction' => 'N/a',
				'message' => "",
			);
		}
		$this->response($data, RestController::HTTP_OK);
	}


	public function get_patient_latest_transaction_get($id)
	{
		$claimModel = new claimModel;
		$result = $claimModel->get_patient_latest_transaction($id);
		$data = [];
		if ($result) {
			if ($this->isWithinThreeMonths($result->claim_date)) {
				$data = array(
					'latest_transaction' => $result->claim_date,
					'message' => "Latest Transaction is within the last 3 months.",
				);
			} else {
				$data = array(
					'latest_transaction' => $result->claim_date,
					'message' => "Latest Transaction is not within the last 3 months.",
				);
			}

		} else {
			$data = array(
				'latest_transaction' => 'N/a',
				'message' => "",
			);
		}
		$this->response($data, RestController::HTTP_OK);
	}



	private function isWithinThreeMonths($dateToCheck)
	{
		// Get the current date
		$currentDate = new DateTime();

		// Convert the given date string to a DateTime object
		$dateToCheck = new DateTime($dateToCheck);

		// Calculate the date 3 months ago from now
		$threeMonthsAgo = $currentDate->modify('-3 months');

		// Check if the date to check is within the last 3 months
		return $dateToCheck >= $threeMonthsAgo && $dateToCheck <= new DateTime();
	}

	public function insert_post()
	{ 

		$claimModel = new claimModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			
			'control_number' => $claimModel->total(),
			'app_year' => date('Y'),
			'app_month' => date('m'),
			'claimant_id' => $requestData['claimant'],
			'patient_id' => $requestData['patient'],
			'financial_assistance_type_id' => $requestData['financial_assistance_type'],
			'purok' => trim($requestData['purok']),
			'barangay_id' => $requestData['barangay'],
			'amount' => $requestData['amount'],
			'claim_date' => $requestData['claim_date'],
			'purpose' => $requestData['purpose'],
			'encoded_by' => $requestData['user_id'],
		);


		$latest_transaction = $claimModel->get_latest_transaction([
			'financial_assistance_type_id' => $requestData['financial_assistance_type'],
			'claimant_id' => $requestData['claimant'],
			'patient_id' => $requestData['patient'],

		], 3);

		if ($latest_transaction) {
			$this->response([
				'status' => false,
				'message' => 'A claim for this financial assistance type has already been made by this claimant and patient within the last 3 months. Please check the latest transaction date.'
			], RestController::HTTP_OK);

		} else {

			// $this->response($data, RestController::HTTP_OK);

			$result = $claimModel->insert($data);

			if ($result > 0) {
				$this->response([
					'status' => true,
					'message' => 'Successfully Inserted.'
				], RestController::HTTP_OK);
			} else {

				$this->response([
					'status' => false,
					'message' => 'Failed to create new record.'
				], RestController::HTTP_OK);
			}

		}


	}

	public function update_put($id)
	{


		$claimModel = new claimModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		if (isset($requestData['claimant'])) {
			$data['claimant_id'] = $requestData['claimant'];
		}


		if (isset($requestData['patient'])) {
			$data['patient_id'] = $requestData['patient'];
		}

		if (isset($requestData['financial_assistance_type'])) {
			$data['financial_assistance_type_id'] = $requestData['financial_assistance_type'];
		}
		if (isset($requestData['purok'])) {
			$data['purok'] = trim($requestData['purok']);
		}

		if (isset($requestData['barangay'])) {
			$data['barangay_id'] = $requestData['barangay'];
		}

		if (isset($requestData['amount'])) {
			$data['amount'] = $requestData['amount'];
		}
		if (isset($requestData['claim_date'])) {
			$data['claim_date'] = $requestData['claim_date'];
		}
		if (isset($requestData['purpose'])) {
			$data['purpose'] = $requestData['purpose'];
		}

		if (isset($requestData['user_id'])) {
			$data['encoded_by'] = $requestData['user_id'];
		}
		$update_result = $claimModel->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$claimModel = new claimModel;
		$result = $claimModel->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


}
