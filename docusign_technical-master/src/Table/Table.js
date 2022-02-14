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
                    axios({
                        url: item.DownloadDocumentHref, 
                        method: 'GET',
                        headers: { Authorization: `Bearer ${bearerToken}`, 'Content-Type': 'application/json' },
                        responseType: 'blob'
                    })
                    .then(result =>{
                        console.log(result.data)
                        const url = window.URL.createObjectURL(new Blob([result.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', item.Name); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                    })
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