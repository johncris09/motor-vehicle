import React, { useRef, useState } from 'react'
import * as Yup from 'yup'
import XlsxPopulate from 'xlsx-populate/browser/xlsx-populate'
import * as XLSX from 'xlsx'
import Select from 'react-select'
import './../../assets/css/custom.css'
import 'cropperjs/dist/cropper.css'
import reportTemplate from './../../assets/report template/MotorVehicleReportTemplate.xlsx'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormText,
  CRow,
} from '@coreui/react'
import { useFormik } from 'formik'
import { ToastContainer } from 'react-toastify'
import {
  api,
  DefaultLoading,
  formatDate,
  motorVehicleStatus,
  requiredField,
} from 'src/components/SystemConfiguration'
import { useMutation, useQuery } from '@tanstack/react-query'
import PageTitle from 'src/components/PageTitle'

const now = new Date()
const formattedDate = `${
  now.getMonth() + 1
}-${now.getDate()}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

const Report = ({ cardTitle }) => {
  const motorVehicleReportRef = useRef()

  const motorVehicleReport = useQuery({
    queryFn: async () =>
      await api.get('office').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.abbr} - ${item.office}`.trim()
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['motorVehicleReport'],
    staleTime: Infinity,
  })
  const handleInputChange = (e) => {
    form.handleChange(e)
    const { name, value, checked } = e.target
    const { status } = form.values

    form.setFieldValue(name, value)
    // Status
    if (name === 'status') {
      if (checked) {
        // Add value to array if checked
        form.setFieldValue('status', [...status, value])
      } else {
        // Remove value from array if unchecked
        form.setFieldValue(
          'status',
          status.filter((h) => h !== value),
        )
      }
    }
  }

  const validationSchema = Yup.object().shape({
    date: Yup.string().required('Date is required'),
  })
  const form = useFormik({
    initialValues: {
      date: '',
      status: [],
      office: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      report.mutate(values)
    },
  })
  const report = useMutation({
    mutationFn: async (values) => {
      return await api.get('motor_vehicle/get_report', { params: values })
    },
    onSuccess: async (response, values) => {
      fetch(reportTemplate)
        .then((response) => response.arrayBuffer()) // Convert file to ArrayBuffer
        .then((buffer) => XlsxPopulate.fromDataAsync(buffer)) // Load workbook
        .then((workbook) => {
          const sheet = workbook.sheet('Sheet1') // Select sheet

          sheet.cell(`A7`).value('As of ' + formatDate(values.date))
          let data = []
          response.data.map((item, index) => {
            // console.info(item)
            let formatCost = parseFloat(item.cost)
            let formattedNumber = formatCost.toLocaleString('en-US', { minimumFractionDigits: 2 })
            let year = new Date(item.date_acquired).getFullYear()
            data.push([
              index + 1,
              item.abbr,
              item.quantity,
              item.model,
              item.vehicle_use,
              item.cylinder_number,
              item.engine_displacement,
              item.fuel_type,
              year,
              formattedNumber,
              item.status,
              item.gsis_period_cover,
              item.lto_period_cover,
            ])
          })

          sheet.cell(`A11`).value(data)
          const columnStyles = [
            { range: 'A', align: 'center' },
            { range: 'B', align: 'center' },
            { range: 'C', align: 'center' },
            { range: 'D', align: 'left' },
            { range: 'E', align: 'center' },
            { range: 'F', align: 'center' },
            { range: 'G', align: 'center' },
            { range: 'H', align: 'center' },
            { range: 'I', align: 'right' },
            { range: 'J', align: 'center' },
            { range: 'K', align: 'center' },
            { range: 'L', align: 'center' },
            { range: 'M', align: 'center' },
          ]

          const lastRow = 10 + data.length

          columnStyles.forEach(({ range, align }) => {
            sheet.range(`${range}11:${range}${lastRow}`).style({
              horizontalAlignment: align,
              border: {
                top: { style: 'thin', color: 'black' },
                bottom: { style: 'thin', color: 'black' },
                left: { style: 'thin', color: 'black' },
                right: { style: 'thin', color: 'black' },
              },
            })
          })

          // Export the modified file
          return workbook.outputAsync()
        })
        .then((updatedBuffer) => {
          // Create a downloadable link
          const blob = new Blob([updatedBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })
          const url = URL.createObjectURL(blob)
          // Create a download link
          const a = document.createElement('a')
          a.href = url
          a.download = 'MotorVehicleReport ' + formattedDate + '.xlsx'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url) // Clean up
        })
        .catch((error) => console.error('Error processing Excel file:', error))
    },
    onError: (error) => {
      console.info(error.response.data)
      // Swal.fire('Error!', 'Error', 'error')
    },
  })

  const handleSelectChange = (selectedOption, ref) => {
    form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }
  return (
    <>
      <ToastContainer />
      <PageTitle pageTitle={cardTitle} />
      <CCard>
        <CCardHeader>{cardTitle}</CCardHeader>
        <CCardBody>
          <CForm className="row g-3 mt-2" onSubmit={form.handleSubmit}>
            <CRow>
              <CCol md={12}>
                <CFormInput
                  type="date"
                  label={requiredField('Date')}
                  name="date"
                  onChange={handleInputChange}
                  value={form.values.date}
                  placeholder="Date"
                  invalid={form.touched.date && form.errors.date}
                />
                {form.touched.date && form.errors.date && (
                  <CFormText className="text-danger">{form.errors.date}</CFormText>
                )}
              </CCol>
              <CCol md={12}>
                <CFormLabel>Office</CFormLabel>

                <Select
                  ref={motorVehicleReportRef}
                  value={
                    !motorVehicleReport.isLoading &&
                    motorVehicleReport.data?.find((option) => option.value === form.values.office)
                  }
                  onChange={handleSelectChange}
                  options={!motorVehicleReport.isLoading && motorVehicleReport.data}
                  name="office"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel>Running Condition</CFormLabel>

                <br />
                {motorVehicleStatus.map((item, index) => (
                  <CFormCheck
                    key={index}
                    inline
                    name="status"
                    id={'vehicleUseOption' + (index + 1)}
                    value={item}
                    label={item}
                    invalid={form.touched.status && form.errors.status}
                    onChange={handleInputChange}
                    checked={form.values.status.includes(item)}
                  />
                ))}
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  Generate
                </CButton>
              </CCol>
            </CRow>
          </CForm>

          {report.isPending && <DefaultLoading />}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Report
