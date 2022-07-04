import React, {useState, useEffect} from 'react'

export default function PrinterTable({tableHead, site}) {

    const [printers, setPrinters] = useState('')
    const [zplOnly, setZplOnly] = useState(false)
    const [activeOnly, setActiveOnly] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchPrinters= async () => {
            const myPrinters = await fetch(`/api/printer?site=${site}`)
                                        .then(res => res.json())
                                            .catch(err => console.log(err))
            setPrinters(myPrinters.data)
        }
       fetchPrinters()
    }, [site])

    const toggleFilter = () => {
        setShowFilter(!showFilter)
        if (!showFilter) {
            document.querySelector('#filterToggle').classList.remove('d-none')
        }
        else document.querySelector('#filterToggle').classList.add('d-none')
    }

    return (
        <div className='container'>
            <input className='px-3 py-2 mb-3 w-50' onChange={(e) => setSearch(e.target.value.toLowerCase())} placeholder="Search to filter by name or IP"/>
            <br/>
            <button className='btn btn-secondary mb-3' onClick={() => toggleFilter()}>Show Filters</button>
                <div id="filterToggle" className='d-flex align-items-center justify-content-center d-none'>
                    <div className='form-check'>
                        <label className='m-2'>ZPL Only</label>
                        <input type="checkbox" onChange={() => setZplOnly(!zplOnly)}></input>
                    </div>
                    <div className='form-check'>
                        <label className='m-2'>Active Only</label>
                        <input type="checkbox" onChange={() => setActiveOnly(!activeOnly)}></input>
                    </div>
                </div>
            <table className="table">
                <thead className='table-dark'> 
                    <tr>
                        {tableHead.map(header => 
                            <th key={header} scope="col">{header}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {printers !=='' && 
                    printers.filter(printer => printer.name.toLowerCase().includes(search) || printer.ipAddress?.includes(search) || search === '').filter(printer => zplOnly === true ? printer.zpl.toString().includes('true') : true).filter(printer => activeOnly === true ? printer.active.toString().includes('true') : true).map((printer, index) => 
                        <tr key={index}>
                            <th>{printer.name}</th>
                            <th>{printer.deviceName}</th>
                            <th>{printer.ipAddress ? printer.ipAddress : "N/A"}</th>
                            <th>{printer.type}</th>
                            <th>{printer.orientation}</th>
                            <th>{printer.port}</th>
                            <th>{printer.zpl.toString()}</th>
                            <th>{printer.active.toString()}</th>
                        </tr>
                        )}
                </tbody>
            </table>
        </div>
    )
}