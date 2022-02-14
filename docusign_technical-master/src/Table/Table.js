import React from 'react';
import axios from 'axios' //Used for HTTPS requests

const Table = ({ list, bearerToken }) =>
<div className="table">
<div className="table-header">
    <span className ="cell">
        Name
    </span>
    <span className ="cell">
        Date Created
    </span>
    <span className ="cell">
        File Size
    </span>
    </div>
    {list.map(item =>
        <div key={item.Name} className='table-row'>
            <span className ="cell">
                <a onClick = { () =>
                    axios.get(item.DownloadDocumentHref, { headers: { Authorization: `Bearer ${bearerToken}`, 'Content-Type': 'application/json' } })
                    .then(result =>{console.log(result.data)})
                }>{item.Name}</a>
            </span>
            <span className ="cell">
                {new Date(item.CreatedDate).getMonth() + '/'+new Date(item.CreatedDate).getDate() + '/'+new Date(item.CreatedDate).getFullYear()}
            </span>
            <span className ="cell">
                {item.NativeFileSize}
            </span>
        </div>
    )}
</div>
export default Table