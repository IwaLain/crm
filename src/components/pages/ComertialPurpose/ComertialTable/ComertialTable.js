import React, { useContext, useEffect, useState } from 'react'
import DataTable from "react-data-table-component"
import { useHistory } from 'react-router-dom'
import { Col, Label } from "reactstrap"
import { GlobalContext } from '../../../../context'
import customersApi from '../../../../js/api/customer'

const ComertialTable = ({changeCurrentData}) => {
    const { selectedCustomer } = useContext(GlobalContext)
    const [currentData, setCurrentData] = useState([])
    const [cols, setCols] = useState([])
    const history = useHistory()
    const newData = []
    const columns = []

    const handlerAmount = (array, itemName, data) => {
        setCurrentData(array.map(itemData => itemData.item === itemName ? {...itemData, itemName: data} : itemData))
    }

    useEffect(() => {
        if (!selectedCustomer || !(Object.keys(selectedCustomer).length > 0)) history.push("/dashboard/customers")
        else customersApi.getNetwork(selectedCustomer.id)
        .then(data => {
            setCurrentData(data.Network)
    
            for (const [key, value] of Object.entries(data.Network)) {
                const obj = {}
    
                obj['item'] = key
                obj['description'] = ''
                obj['units'] = 'EA'
                obj['quantity'] = Number(value)
                obj['rate'] = 0
                obj['amount'] = 0.00
                newData.unshift(obj)
            }
    
            Object.keys(newData[0]).forEach(key => {
                if ( key === 'item' || key === 'units' || key === 'quantity' ) {
                    columns.push({
                        name: key,
                        selector: row => row[key]
                    })
                }
                if ( key === 'description') {
                    columns.push({
                        name: key,
                        selector: row => row[key],
                        cell: row =>
                        <input
                            type={key}
                            name={key}
                            className="ui-kit__input"
                            onBlur={(e) => {
                                row[key] = e.target.value
                                handlerAmount(newData, row['item'], row[key])
                            }}
                        />,
                    })
                }
                if ( key === 'rate') {
                    columns.push({
                        name: 'price',
                        selector: row => row[key],
                        cell: row => <input
                            type={key}
                            name={key}
                            className="ui-kit__input"
                            onBlur={(e) => {
                                row[key] = Number(e.target.value)
                                row['amount'] = row['quantity'] * row[key]
                                handlerAmount(newData, row['item'], row['amount'])
                            }}
                            
                        />
                    })
                }
                if ( key === 'amount') {
                    columns.push({
                        name: key,
                        selector: row => row['amount'],
                        cell: row => row['amount']
                    })
                }
            })
    
            setCurrentData(newData)
            changeCurrentData(newData)
            setCols(columns)
        })
    }, [])


    return (
        <Col>
            <Label>Email orders to orders@waites.net</Label>
            <DataTable
                dense
                direction="auto"
                columns={cols}
                data={currentData}
            />
        </Col>
    )
}

export default ComertialTable
