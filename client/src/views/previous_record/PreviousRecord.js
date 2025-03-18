import React, { useState } from 'react'
import 'cropperjs/dist/cropper.css'
import MaterialReactTable from 'material-react-table'
import { ToastContainer } from 'react-toastify'
import { api } from 'src/components/SystemConfiguration'
import { useQuery } from '@tanstack/react-query'
import PageTitle from 'src/components/PageTitle'

const PreviousRecord = ({ cardTitle }) => {
  const column = [
    {
      accessorKey: 'office',
      header: 'Office',
    },
    {
      accessorKey: 'plate_number',
      header: 'Plate #',
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
      header: 'chassis #',
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
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'mv',
      header: 'MV Year',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
  ]

  const previousRecord = useQuery({
    queryFn: async () =>
      await api.get('previous_record').then((response) => {
        return response.data
      }),
    queryKey: ['previousRecord'],
    staleTime: Infinity,
  })

  return (
    <>
      <ToastContainer />
      <PageTitle pageTitle={cardTitle} />
      <MaterialReactTable
        columns={column}
        data={!previousRecord.isLoading && previousRecord.data}
        state={{
          isLoading: previousRecord.isLoading,
          isSaving: previousRecord.isLoading,
          showLoadingOverlay: previousRecord.isLoading,
          showProgressBars: previousRecord.isLoading,
          showSkeletons: previousRecord.isLoading,
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
        enableGrouping
        initialState={{
          density: 'compact',
        }}
      />
    </>
  )
}

export default PreviousRecord
