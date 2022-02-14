import './App.css'; //Basic Styling
import axios from 'axios' //Used for HTTPS requests
import Table from './Table' //Used to draw the table to show the files
import React, { Component } from 'react';
import {
  AUTH_ENDPOINT,
  FOLDERS_ENDPOINT,
  UPLOAD_ENDPOINT,
  DOWNLOAD_ENDPOINT,
  CLIENT_ID,
  CLIENT_SECRET,
} from './constants'; //Constants for sample endpoints/folders/credentials

class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      files: null,
      error: null,
      bearerToken: null,
      fileToUpload: null,
      fileName: null,
      fileType: null,
    };
    this.fetchFiles = this.fetchFiles.bind(this);
    this.getBearerToken = this.getBearerToken.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleFileSelected = this.handleFileSelected.bind(this)
  }
  handleUpload(e) {
    if (this.state.fileToUpload !== null) {

      let formData = new FormData();
      formData.append(this.state.fileName, new Blob([this.state.fileToUpload], {'Content-Type': this.state.fileType}), this.state.fileName);

      axios({
        method: 'post',
        url: UPLOAD_ENDPOINT + this.state.fileName,
        data: formData,
        headers:
          {
            Authorization: `Bearer ${this.state.bearerToken}`,
            'Content-Type': 'multipart/form-data'
          }
      }
      )
        .then(result => {
            this.fetchFiles()
            const fileName = null;
            const file = null;
            const fileType = null;
            this.setState({fileName})
            this.setState({file})
            this.setState({fileType})
            
        })
        .catch(error => this.setState({ error }))
    }
  }
  getBearerToken() {
    axios.post(`${AUTH_ENDPOINT}`, { 'client_id': `${CLIENT_ID}`, 'client_secret': `${CLIENT_SECRET}` })
      .then(result => {
        const bearerToken = result.data.access_token;
        this.setState({ bearerToken });
        this.fetchFiles();
      })
      .catch(error => this.setState({ error }));
  }

  fetchFiles() {
    axios.get(`${FOLDERS_ENDPOINT}`, { headers: { Authorization: `Bearer ${this.state.bearerToken}`, 'Content-Type': 'application/json' } })
      .then(result => {
        console.log(result.data)
        const files = result.data.Documents.Items

        this.setState({ files });
      })
      .catch(error => this.setState({ error }));
  }

  handleFileSelected(e) {
    const fileToUpload = e.target.files[0];
    this.setState({ fileToUpload });
    const fileName = e.target.files[0].name;
    this.setState({ fileName });
    const fileType = e.target.files[0].fileType;
  }

  componentDidMount() {
    this._isMounted = true;
    this.getBearerToken();
  }

  render() {
    const { files, error } = this.state;
    const list = files || [];
    const displayedFiles =
      <Table
        list={list}
        bearerToken={this.state.bearerToken}
      />

    const errorMessage =
      <div>
        {this.state.error}
      </div>

    return (
      <div className="page">
        <p>DocuSign Technical Demo</p>
        <div className="interactions">
          <div>
            <label>Upload a file: </label>
            <input type="file" onChange={(e) => this.handleFileSelected(e)} />
            <input className="submit" type="submit" onClick={(e) => this.handleUpload(e)} value="Submit" />
          </div>
          {list.length ? displayedFiles : ""}
        </div>
      </div>
    );
  }
}

export default App;

