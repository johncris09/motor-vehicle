import React, { useRef, useState } from 'react'
import { ExportToCsv } from 'export-to-csv'
import Select from 'react-select'
import Swal from 'sweetalert2'
import 'cropperjs/dist/cropper.css'
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
  CFormSelect,
  CFormText,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileExcel,
  faMinusCircle,
  faPlus,
  faPlusCircle,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, Tooltip } from '@mui/material'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  fuelType,
  motorVehicleStatus,
  requiredField,
  validationPrompt,
  vehicleType,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'

const Patient = ({ cardTitle }) => {
  const user = jwtDecode(localStorage.getItem('motorVehicleToken'))
  const queryClient = useQueryClient()
  const motorVehicleOfficeInputRef = useRef()
  const [modalVisible, setModalVisible] = useState(false)
  const column = [
    {
      accessorKey: 'abbr',
      header: 'Office',
    },
    {
      accessorKey: 'plate_number',
      header: 'Plate Number',
    },
    {
      accessorKey: 'model',
      header: 'Model',
    },
    {
      accessorKey: 'engine_number',
      header: 'Engine #',
    },
    {
      accessorKey: 'chassis_number',
      header: 'Chassis #',
    },
    {
      accessorKey: 'date_acquired',
      header: 'Date Acquired',
    },
    {
      accessorKey: 'cost',
      header: 'Cost',
    },
    {
      accessorKey: 'color',
      header: 'Color',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'return_number',
      header: 'Return #',
    },
    {
      accessorKey: 'return_date',
      header: 'Return Date',
    },
    {
      accessorKey: 'vehicle_type',
      header: 'Vehicle Type',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
    },
    {
      accessorKey: 'fuel_type',
      header: 'Fuel Type',
    },
    {
      accessorKey: 'vehicle_use',
      header: 'Vehicle Use',
    },
    {
      accessorKey: 'cylinder_number',
      header: 'No. of Cyl.',
    },
    {
      accessorKey: 'engine_displacement',
      header: 'Engine Displacement',
    },
    {
      accessorKey: 'end_user',
      header: 'End user',
    },
    {
      accessorKey: 'designated_driver',
      header: 'Designated Driver',
    },
    {
      accessorKey: 'gsis_date_renew',
      header: 'GSIS Date Renew',
    },
    {
      accessorKey: 'gsis_period_cover',
      header: 'GSIS Period Covered',
    },

    {
      accessorKey: 'gsis_or_number',
      header: 'GSIS OR Number',
    },
    {
      accessorKey: 'lto_date_renew',
      header: 'LTO Date Renew',
    },
    {
      accessorKey: 'lto_period_cover',
      header: 'LTO Due for Renewal',
    },
    {
      accessorKey: 'lto_or_number',
      header: 'LTO OR Number',
    },
    {
      accessorKey: 'remarks',
      header: 'Remarks',
    },
  ]

  const motorVehicle = useQuery({
    queryFn: async () =>
      await api.get('motor_vehicle').then((response) => {
        return response.data
      }),
    queryKey: ['motorVehicle'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    office: Yup.string().required('Office is required'),
    date_acquired: Yup.string().required('Date Acquired is required'),
    cost: Yup.string().required('Cost is required'),
    vehicle_use: Yup.array()
      .min(1, 'At least one vehicle use is required')
      .required('Vehicle Use is required'),
    return_number: Yup.string().when('status', {
      is: (value) => value === 'Unserviceable',
      then: (schema) => schema.required('Return Number is required'),
      otherwise: (schema) => schema,
    }),
    return_date: Yup.string().when('status', {
      is: (value) => value === 'Unserviceable',
      then: (schema) => schema.required('Return Date is required'),
      otherwise: (schema) => schema,
    }),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      office: '',
      plate_number: '',
      model: '',
      engine_number: '',
      chassis_number: '',
      date_acquired: '',
      cost: '',
      color: '',
      status: '',
      return_number: '',
      return_date: '',
      vehicle_type: '',
      quantity: '',
      fuel_type: '',
      vehicle_use: [],
      cylinder_number: '',
      engine_displacement: '',
      encoded_by: user.id,
      gsis_date_renew: '',
      gsis_period_cover: '',
      gsis_or_number: '',
      lto_date_renew: '',
      lto_period_cover: '',
      lto_or_number: '',
      remarks: '',
      end_user: '',
      designated_driver: [''],
    },
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateMotorVehicle.mutate(values)
      } else {
        await insertMotorVehicle.mutate(values)
      }
    },
  })

  const insertMotorVehicle = useMutation({
    mutationFn: async (values) => {
      return await api.post('motor_vehicle/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
        form.resetForm()
      } else {
        toast.error(response.data.message)
      }
      await queryClient.invalidateQueries(['motorVehicle'])
    },
    onError: (error) => {
      console.info(error)
      Swal.fire({
        title: 'Error!',
        html: 'A Database Error Occurred',
        icon: 'error',
      })
    },
  })
  const updateMotorVehicle = useMutation({
    mutationFn: async (values) => {
      return await api.put('motor_vehicle/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
        form.resetForm()
        setModalVisible(false)
        await queryClient.invalidateQueries(['motorVehicle'])
      } else {
        toast.error(response.data.message)
      }
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error!',
        html: 'A Database Error Occurred',
        icon: 'error',
      })
    },
  })

  const handleInputChange = (e) => {
    form.handleChange(e)
    const { name, value, checked } = e.target
    const { vehicle_use } = form.values
    form.setFieldValue(name, value)
    // Vehicle Use
    if (name === 'vehicle_use') {
      if (checked) {
        // Add value to array if checked
        form.setFieldValue('vehicle_use', [...vehicle_use, value])
      } else {
        // Remove value from array if unchecked
        form.setFieldValue(
          'vehicle_use',
          vehicle_use.filter((h) => h !== value),
        )
      }
    }
    if (name === 'designated_driver[' + e.target.dataset.index + ']') {
      // Update the specific index without appending new values
      const updatedDrivers = [...form.values.designated_driver]
      updatedDrivers[e.target.dataset.index] = value
      form.setFieldValue('designated_driver', updatedDrivers)
    }
  }

  const motorVehicleOffice = useQuery({
    queryFn: async () =>
      await api.get('office').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.abbr} - ${item.office}`.trim()
          return { value, label }
        })

        return formattedData
      }),
    queryKey: ['motorVehicleOffice'],
    staleTime: Infinity,
    // refetchInterval: 1000,
  })

  const handleSelectChange = (selectedOption, ref) => {
    form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: column.map((c) => c.header),
  }

  const csvExporter = new ExportToCsv(csvOptions)

  const handleExportData = () => {
    const exportedData =
      !motorVehicle.isLoading &&
      motorVehicle.data.map((item) => {
        return {
          Office: item.abbr,
          'Plate Number': item.plate_number || '',
          Model: item.model || '',
          'Engine #': item.engine_number || '',
          'Chassis #': item.chassis_number || '',
          'Date Acquired': item.date_acquired || '',
          Cost: item.cost || '',
          Color: item.color || '',
          Status: item.status || '',
          'Return #': item.return_number || '',
          'Return Date': item.return_date || '',
          'Vehicle Type': item.vehicle_type || '',
          Quantity: item.quantity || '',
          'Fuel Type': item.fuel_type || '',
          'Vehicle Use': item.vehicle_use || '',
          'No. of Cyl.': item.cylinder_number || '',
          'Engine Displacement': item.engine_displacement || '',
          'End User': item.end_user || '',
          'Designated Driver': item.designated_driver || '',
          'GSIS Date Renew': item.gsis_date_renew || '',
          'GSIS Period Covered': item.gsis_period_cover || '',
          'GSIS OR Number': item.gsis_or_number || '',
          'LTO Date Renew': item.lto_date_renew || '',
          'LTO Due for Renewal': item.lto_period_cover || '',
          'LTO OR Number': item.lto_or_number || '',
          Remarks: item.remarks || '',
        }
      })
    csvExporter.generateCsv(exportedData)
  }
  const removeDriver = (index) => {
    const updatedDrivers = form.values.designated_driver.filter((_, i) => i !== index)
    form.setFieldValue('designated_driver', updatedDrivers)
  }

  const addDriver = () => {
    form.setFieldValue('designated_driver', [...form.values.designated_driver, ''])
  }
  return (
    <>
      <ToastContainer />
      <CCard>
        <CCardHeader>
          {cardTitle}
          <div className="float-end">
            <CButton
              size="sm"
              onClick={() => {
                form.resetForm()
                // setIsEnableEdit(false)

                setModalVisible(true)
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add {cardTitle}
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={!motorVehicle.isLoading && motorVehicle.data}
            state={{
              isLoading:
                motorVehicle.isLoading ||
                insertMotorVehicle.isPending ||
                updateMotorVehicle.isPending,
              isSaving:
                motorVehicle.isLoading ||
                insertMotorVehicle.isPending ||
                updateMotorVehicle.isPending,
              showLoadingOverlay:
                motorVehicle.isLoading ||
                insertMotorVehicle.isPending ||
                updateMotorVehicle.isPending,
              showProgressBars:
                motorVehicle.isLoading ||
                insertMotorVehicle.isPending ||
                updateMotorVehicle.isPending,
              showSkeletons:
                motorVehicle.isLoading ||
                insertMotorVehicle.isPending ||
                updateMotorVehicle.isPending,
            }}
            muiCircularProgressProps={{
              color: 'secondary',
              thickness: 5,
              size: 55,
            }}
            muiSkeletonProps={{
              animation: 'pulse',
              height: 28,
            }}
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            initialState={{
              density: 'compact',
              columnPinning: { left: ['mrt-row-actions'] },
            }}
            renderTopToolbarCustomActions={({ table }) => (
              <Box
                className="d-none d-lg-flex"
                sx={{
                  display: 'flex',
                  gap: '.2rem',
                  p: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <CButton
                  className="btn-info text-white"
                  onClick={async () =>
                    await queryClient.resetQueries({ queryKey: ['motorVehicle'] })
                  }
                  size="sm"
                >
                  <FontAwesomeIcon icon={faRefresh} /> Refresh
                </CButton>
                <CButton className="btn-info text-white" onClick={handleExportData} size="sm">
                  <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                </CButton>
              </Box>
            )}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                <Tooltip title="Edit">
                  <IconButton
                    color="warning"
                    onClick={() => {
                      const allowedValues = ['Passenger', 'Transport', 'Patient', 'Goods/Services']
                      let vehicleUseOperator = ''
                      let vehicleUse = row.original.vehicle_use || '' // default to empty string if null or undefined

                      let vehicleUseArray = vehicleUse.split(', ').filter((value) => {
                        if (!allowedValues.includes(value)) {
                          vehicleUseOperator = value // Assign value to vehicle_use_operator if not in allowedValues
                          return false // Exclude from vehicleUseArray
                        }
                        return true // Keep allowed values
                      })
                      form.setValues({
                        id: row.original.id,
                        office: row.original.office_id,
                        plate_number: row.original.plate_number,
                        model: row.original.model,
                        engine_number: row.original.engine_number,
                        chassis_number: row.original.chassis_number,
                        date_acquired: row.original.date_acquired,
                        quantity: row.original.quantity,
                        cost: row.original.cost,
                        color: row.original.color,
                        vehicle_use: vehicleUseArray,
                        cylinder_number: row.original.cylinder_number,
                        fuel_type: row.original.fuel_type,
                        engine_displacement: row.original.engine_displacement,
                        status: row.original.status,
                        vehicle_type: row.original.vehicle_type,
                        gsis_date_renew: row.original.gsis_date_renew,
                        gsis_or_number: row.original.gsis_or_number,
                        gsis_period_cover: row.original.gsis_period_cover,

                        lto_date_renew: row.original.lto_date_renew,
                        lto_period_cover: row.original.lto_period_cover,
                        lto_or_number: row.original.lto_or_number,
                        remarks: row.original.remarks,
                        end_user: row.original.end_user,
                        designated_driver: row?.original?.designated_driver
                          ? row.original.designated_driver
                              .split(', ')
                              .map((driver) => driver.trim())
                          : [''],
                      })
                      setModalVisible(true)
                    }}
                  >
                    <EditSharp />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => {
                      Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!',
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          validationPrompt(async () => {
                            let id = row.original.id

                            await api
                              .delete('motor_vehicle/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries(['motorVehicle'])

                                toast.success(response.data.message)
                              })
                              .catch((error) => {
                                console.info(error.response.data)
                                // toast.error(handleError(error))
                              })
                          })
                        }
                      })
                    }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />
        </CCardBody>
      </CCard>
      <CModal
        alignment="center"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>{form.values.id ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm className="row g-3 mt-4" onSubmit={form.handleSubmit}>
            <CRow>
              <CCol md={6}>
                <CFormLabel>{requiredField('Office')}</CFormLabel>

                <Select
                  ref={motorVehicleOfficeInputRef}
                  value={
                    !motorVehicleOffice.isLoading &&
                    motorVehicleOffice.data?.find((option) => option.value === form.values.office)
                  }
                  onChange={handleSelectChange}
                  options={!motorVehicleOffice.isLoading && motorVehicleOffice.data}
                  name="office"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Plate Number"
                  name="plate_number"
                  onChange={handleInputChange}
                  value={form.values.plate_number}
                  placeholder="Plate Number"
                  invalid={form.touched.plate_number && form.errors.plate_number}
                />
                {form.touched.plate_number && form.errors.plate_number && (
                  <CFormText className="text-danger">{form.errors.plate_number}</CFormText>
                )}
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Model/Make"
                  name="model"
                  onChange={handleInputChange}
                  value={form.values.model}
                  placeholder="Model/Make"
                  invalid={form.touched.model && form.errors.model}
                />
                {form.touched.model && form.errors.model && (
                  <CFormText className="text-danger">{form.errors.model}</CFormText>
                )}
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Engine #"
                  name="engine_number"
                  onChange={handleInputChange}
                  value={form.values.engine_number}
                  placeholder="Engine #"
                  invalid={form.touched.engine_number && form.errors.engine_number}
                />
                {form.touched.engine_number && form.errors.engine_number && (
                  <CFormText className="text-danger">{form.errors.engine_number}</CFormText>
                )}
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label="Chassis #"
                  name="chassis_number"
                  onChange={handleInputChange}
                  value={form.values.chassis_number}
                  placeholder="Chassis #"
                  invalid={form.touched.chassis_number && form.errors.chassis_number}
                />
                {form.touched.chassis_number && form.errors.chassis_number && (
                  <CFormText className="text-danger">{form.errors.chassis_number}</CFormText>
                )}
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="date"
                  label={requiredField('Date Acquired')}
                  name="date_acquired"
                  onChange={handleInputChange}
                  value={form.values.date_acquired}
                  placeholder="Date Acquired"
                  invalid={form.touched.date_acquired && form.errors.date_acquired}
                />
                {form.touched.date_acquired && form.errors.date_acquired && (
                  <CFormText className="text-danger">{form.errors.date_acquired}</CFormText>
                )}
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="number"
                  label="Quantity"
                  name="quantity"
                  onChange={handleInputChange}
                  value={form.values.quantity}
                  placeholder="Quantity"
                  invalid={form.touched.quantity && form.errors.quantity}
                />
                {form.touched.quantity && form.errors.quantity && (
                  <CFormText className="text-danger">{form.errors.quantity}</CFormText>
                )}
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="number"
                  label={requiredField('Cost')}
                  name="cost"
                  onChange={handleInputChange}
                  value={form.values.cost}
                  placeholder="Cost"
                  invalid={form.touched.cost && form.errors.cost}
                />
                {form.touched.cost && form.errors.cost && (
                  <CFormText className="text-danger">{form.errors.cost}</CFormText>
                )}
              </CCol>
              <CCol md={3}>
                <CFormInput
                  type="text"
                  label={requiredField('Color')}
                  name="color"
                  onChange={handleInputChange}
                  value={form.values.color}
                  placeholder="Color"
                  invalid={form.touched.color && form.errors.color}
                />
                {form.touched.color && form.errors.color && (
                  <CFormText className="text-danger">{form.errors.color}</CFormText>
                )}
              </CCol>

              <CCol md={5}>
                <CFormLabel>{requiredField('Vehicle Use')}</CFormLabel>

                <br />
                <CFormCheck
                  inline
                  name="vehicle_use"
                  id="vehicleUseOption1"
                  value="Passenger"
                  label="Passenger"
                  invalid={form.touched.vehicle_use && form.errors.vehicle_use}
                  onChange={handleInputChange}
                  checked={form.values.vehicle_use.includes('Passenger')}
                />
                <CFormCheck
                  inline
                  name="vehicle_use"
                  id="vehicleUseOption2"
                  value="Transport"
                  label="Transport"
                  invalid={form.touched.vehicle_use && form.errors.vehicle_use}
                  onChange={handleInputChange}
                  checked={form.values.vehicle_use.includes('Transport')}
                />
                <CFormCheck
                  inline
                  name="vehicle_use"
                  id="vehicleUseOption3"
                  value="Patient"
                  label="Patient"
                  invalid={form.touched.vehicle_use && form.errors.vehicle_use}
                  onChange={handleInputChange}
                  checked={form.values.vehicle_use.includes('Patient')}
                />
                <CFormCheck
                  inline
                  name="vehicle_use"
                  id="vehicleUseOption4"
                  value="Goods/Services"
                  label="Goods/Services"
                  invalid={form.touched.vehicle_use && form.errors.vehicle_use}
                  onChange={handleInputChange}
                  checked={form.values.vehicle_use.includes('Goods/Services')}
                />

                {form.touched.vehicle_use && form.errors.vehicle_use && (
                  <CFormText className="text-danger">{form.errors.vehicle_use}</CFormText>
                )}
              </CCol>

              <CCol md={2}>
                <CFormInput
                  type="text"
                  label="No. Cyl."
                  name="cylinder_number"
                  onChange={handleInputChange}
                  value={form.values.cylinder_number}
                  placeholder="No. Cyl."
                  invalid={form.touched.cylinder_number && form.errors.cylinder_number}
                />
                {form.touched.cylinder_number && form.errors.cylinder_number && (
                  <CFormText className="text-danger">{form.errors.cylinder_number}</CFormText>
                )}
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  label={requiredField('Fuel Type')}
                  name="fuel_type"
                  onChange={handleInputChange}
                  value={form.values.fuel_type}
                  invalid={form.touched.fuel_type && form.errors.fuel_type}
                >
                  <option value="">Select</option>
                  {fuelType.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </CFormSelect>
                {form.touched.fuel_type && form.errors.fuel_type && (
                  <CFormText className="text-danger">{form.errors.fuel_type}</CFormText>
                )}
              </CCol>

              <CCol md={2}>
                <CFormInput
                  type="text"
                  label="Eng. Disp."
                  name="engine_displacement"
                  onChange={handleInputChange}
                  value={form.values.engine_displacement}
                  placeholder="Eng. Disp."
                  invalid={form.touched.engine_displacement && form.errors.engine_displacement}
                />
                {form.touched.engine_displacement && form.errors.engine_displacement && (
                  <CFormText className="text-danger">{form.errors.engine_displacement}</CFormText>
                )}
              </CCol>

              <CCol md={6}>
                <CFormSelect
                  label={requiredField('Status')}
                  name="status"
                  onChange={handleInputChange}
                  value={form.values.status}
                  invalid={form.touched.status && form.errors.status}
                >
                  <option value="">Select</option>
                  {motorVehicleStatus.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </CFormSelect>
                {form.touched.status && form.errors.status && (
                  <CFormText className="text-danger">{form.errors.status}</CFormText>
                )}
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  label="Vehicle Type"
                  name="vehicle_type"
                  onChange={handleInputChange}
                  value={form.values.vehicle_type}
                  invalid={form.touched.vehicle_type && form.errors.vehicle_type}
                >
                  <option value="">Select</option>
                  {vehicleType.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </CFormSelect>
                {form.touched.vehicle_type && form.errors.vehicle_type && (
                  <CFormText className="text-danger">{form.errors.vehicle_type}</CFormText>
                )}
              </CCol>

              {form.values.status === 'Unserviceable' && (
                <>
                  <CCol md={6}>
                    <CFormInput
                      type="text"
                      label={requiredField('Return #')}
                      name="return_number"
                      onChange={handleInputChange}
                      value={form.values.return_number}
                      placeholder="Return #"
                      invalid={form.touched.return_number && form.errors.return_number}
                    />
                    {form.touched.return_number && form.errors.return_number && (
                      <CFormText className="text-danger">{form.errors.return_number}</CFormText>
                    )}
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="date"
                      label={requiredField('Return Date')}
                      name="return_date"
                      onChange={handleInputChange}
                      value={form.values.return_date}
                      placeholder="Date Acquired"
                      invalid={form.touched.return_date && form.errors.return_date}
                    />
                    {form.touched.return_date && form.errors.return_date && (
                      <CFormText className="text-danger">{form.errors.return_date}</CFormText>
                    )}
                  </CCol>
                </>
              )}
            </CRow>
            <hr />
            <CRow>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="End User"
                  placeholder="End User"
                  name="end_user"
                  onChange={handleInputChange}
                  value={form.values.end_user}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={12}>
                <CFormLabel>Designated Driver</CFormLabel>
                <table>
                  {form.values.designated_driver.map((driver, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <CFormInput
                          type="text"
                          name={`designated_driver[${index}]`}
                          value={form.values.designated_driver[index]}
                          onChange={handleInputChange}
                          data-index={index}
                          style={{ width: '510px' }}
                        />
                      </td>
                      <td>
                        {index === 0 ? (
                          <CButton color="primary" title="Add Driver" onClick={addDriver}>
                            <FontAwesomeIcon icon={faPlusCircle} />
                          </CButton>
                        ) : (
                          <CButton
                            color="danger"
                            title="Remove Driver"
                            onClick={() => removeDriver(index)}
                          >
                            <FontAwesomeIcon icon={faMinusCircle} />
                          </CButton>
                        )}
                      </td>
                    </tr>
                  ))}
                </table>
              </CCol>
            </CRow>
            <hr />
            <CRow>
              <h6>GSIS Insurance Renewal</h6>
              <CCol md={4}>
                <CFormInput
                  type="date"
                  label="Date Renew"
                  name="gsis_date_renew"
                  onChange={handleInputChange}
                  value={form.values.gsis_date_renew}
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="date"
                  label="Period Covered"
                  name="gsis_period_cover"
                  onChange={handleInputChange}
                  value={form.values.gsis_period_cover}
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  label="OR #"
                  placeholder="OR #"
                  name="gsis_or_number"
                  onChange={handleInputChange}
                  value={form.values.gsis_or_number}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <h6>LTO Registration Renewal</h6>
              <CCol md={4}>
                <CFormInput
                  type="date"
                  label="Date Renew"
                  name="lto_date_renew"
                  onChange={handleInputChange}
                  value={form.values.lto_date_renew}
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="date"
                  label="Due for Renewal"
                  name="lto_period_cover"
                  onChange={handleInputChange}
                  value={form.values.lto_period_cover}
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  label="OR #"
                  placeholder="OR #"
                  name="lto_or_number"
                  onChange={handleInputChange}
                  value={form.values.lto_or_number}
                />
              </CCol>
            </CRow>
            <hr />
            <CRow>
              <CCol md={12}>
                <CFormTextarea
                  label={requiredField('Remarks')}
                  name="remarks"
                  onChange={handleInputChange}
                  placeholder="Remarks"
                  rows={7}
                  invalid={form.touched.remarks && form.errors.remarks}
                >
                  {form.values.remarks}
                </CFormTextarea>

                {form.touched.remarks && form.errors.remarks && (
                  <CFormText className="text-danger">{form.errors.remarks}</CFormText>
                )}
              </CCol>
            </CRow>{' '}
            <hr />
            <CRow>
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="float-end">
                  {form.values.id ? 'Update' : 'Submit'}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
          {(insertMotorVehicle.isPending || updateMotorVehicle.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default Patient
