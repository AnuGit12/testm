import React from 'react';
import { Card, Button, CardTitle,FormGroup, Label, CardText, Modal, ModalHeader, ModalBody, ModalFooter,Row, Col, InputGroup, InputGroupAddon, Input, Form, Table } from 'reactstrap';

import './style.css'
import TableData from './table.jsx';
import { Api } from './utils/api';

import Papa from 'papaparse';


import SliderContext from './context/sliderContext';

import * as _ from 'lodash';


class Panel extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      processing: false,
      csvfile: undefined,
      input: '',
      output: '',
      constraint: '',
      ymax_arr: [],
      selected_slider_data: [],
      selected_dots: [],
      modal1:false
    };

    this.data = [];
    this.ymaxFinalData=[];
    this.updateData = this.updateData.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggle1 = this.toggle1.bind(this);

    this.saveState = this.saveState.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
  toggle1() {
    this.setState(prevState => ({
      modal1: !prevState.modal1
    }));
  }

  // getting dropdown values from graph panel
  getDropdownValue=(value)=>{
    console.log("dropdon value",value)
  }

  handleChangeModal=(e)=>{
    this.state_name = e.target.value
    
  }


  //Save State button function

saveState = () =>{
  this.setState(prevState => ({
    modal: !prevState.modal
  }));
  var saved_state_name = this.state_name
  var tableData=this.data
  console.log("tableData", tableData)
  var slidersData=this.context.sliderData
  console.log("slider data", slidersData)
  var dropdownData=this.context.selectedDropdown
  console.log("dropdown values",dropdownData)
  var input = this.state.input
  var output = this.state.output
  var constraint = this.state.constraint

  console.log("INPUT VALUES",input, output, constraint)
  var other_data = {'state_name':saved_state_name,'input':input,'output':output,'constraint':constraint,"dropdown":dropdownData}

  console.log("filename",this.csvfile)
  var promises = [Api.setTableData(tableData),Api.setSliderData(slidersData),Api.setOtherData(other_data)]
  // Promise.all(promises)
  // .then((response) => {

  // })
  // .catch((error) => {

  // })
}


  //Submit button function
  handlesubmit = (event) => {
    event.preventDefault()
    var input = parseInt(this.state.input)
    var output = parseInt(this.state.output)
    var constraint = parseInt(this.state.constraint)
    var length = this.context.key.length
    var ymax_arr = []
    var totalVal = input + output + constraint
    let arr_final = []

    if (totalVal == length) {
      alert("validated !!")
      for (let i = 1; i <= input; i++) {
        arr_final.push("X" + i)
      }
      for (let i = 1; i <= output; i++) {
        arr_final.push("Y" + i)
        ymax_arr.push("Y" + i)
      }
      for (let i = 1; i <= constraint; i++) {
        arr_final.push("C" + i)
      }
      // arr_final.push(""Ymax")
      var ar1 = ["X1","X2","Y1","Y2","Y3","Y4","Ymax"]
      this.context.updateData({ ymax_arr })
      this.context.updateState({ key: ar1 });

      this.setState({
        processing: true
      }, () => {
        var temp_data = [];
        const getMatrixColumn = (arr, n) => _.map(arr, x => x[n]);

        // setTimeout(() => {
          _.forEach(arr_final, (a, j) => {
            var x1, x2, Xrange, x1_1, x1_2, x1_3, x1_4, x1_5,x1_min,x2_max

            var columnArray = getMatrixColumn(this.data, j);
            x1 = _.floor(_.min(columnArray), 6);   //getting min value of slider
            x2 = _.floor(_.max(columnArray), 6);   //getting max value of slider
            Xrange = _.floor((x2 - x1), 6);
            x1_min = x1 - 0.1*(x2 - x1)
            x2_max = x2 + 0.1*(x2 - x1)
            // console.log("@@@",x1,x2,Xrange)
            x1_1 = x1 + 0.1 * Xrange;  //setting slider handle points values
            x1_2 = x1 + 0.3 * Xrange;  //setting slider handle points values
            x1_3 = x1 + 0.5 * Xrange;  //setting slider handle points values
            x1_4 = x1 + 0.7 * Xrange;  //setting slider handle points values
            x1_5 = x1 + 0.9 * Xrange;  //setting slider handle points values
            temp_data.push({
              [a]: {
                "min": x1_min,
                "max": x2_max,
                "point1": x1_1,
                "point2": x1_2,
                "point3": x1_3,
                "point4": x1_4,
                "point5": x1_5
              }
            });
          });

          
        // }, 1000);
        var csvData = this.data
        var ySlider =  arr_final
        var ymaxData =[]
        var startPoint = this.state.input
        for (var j=startPoint;j<arr_final.length; j++){
          var k, yhandle1, yhandle2 , current_value
          var addition_term
          var multiplication_term
    
             var ydata = []
             var len2 = this.context.key.indexOf(ySlider[j])
              this.data.map((item, key) =>{
                current_value = item[len2]
               var slider_val = temp_data.find(val => val[ySlider[j]]);
                var yslider_p1 = slider_val[ySlider[j]].point1
                var yslider_p2 = slider_val[ySlider[j]].point2
                var yslider_p3 = slider_val[ySlider[j]].point3
                var yslider_p4 = slider_val[ySlider[j]].point4
                var yslider_p5 = slider_val[ySlider[j]].point5
                var ymin = slider_val[ySlider[j]].min
                var ymax = slider_val[ySlider[j]].max
                if (item[len2]<yslider_p1){
                  k=1
                  yhandle1= ymin
                  yhandle2 = yslider_p1
                  
                }else if(item[len2]>yslider_p1 && item[len2]<yslider_p2){
                  k=2
                  yhandle1= yslider_p1
                  yhandle2 = yslider_p2
                }else if(item[len2]>yslider_p2 && item[len2]<yslider_p3){
                  k=3
                  yhandle1= yslider_p2
                  yhandle2 = yslider_p3
                }else if(item[len2]>yslider_p3 && item[len2]<yslider_p4){
                  k=4
                  yhandle1= yslider_p3
                  yhandle2 = yslider_p4
                }else if(item[len2]>yslider_p4 && item[len2]<yslider_p5){
                  k=5
                  yhandle1= yslider_p4
                  yhandle2 = yslider_p5
                }else if(item[len2]>yslider_p5){
                  k=6
                  yhandle1= yslider_p5
                  yhandle2 = ymax
                }
                
                if(k==1){
                  addition_term=0
                  multiplication_term=0.1
                }else if(k==2){
                  addition_term=0.1
                  multiplication_term=0.2
                }else if(k==3){
                  addition_term=0.3
                  multiplication_term=0.2
                }else if(k==4){
                  addition_term=0.5
                  multiplication_term=0.2
                }else if(k==5){
                  addition_term=0.7
                  multiplication_term=0.2
                }else if(k==6){
                  addition_term=0.9
                  multiplication_term=0.1
                }
    
                var y_max_value = addition_term + multiplication_term*((current_value - yhandle1)/(yhandle2-yhandle1))
                ydata.push(y_max_value)
              }
            )
          
          ymaxData = ymaxData.slice()
          ymaxData.push(ydata)
          console.log("Y@",ymaxData)
      }
      var final_ymax_col =[]
      for(var j=0; j<ymaxData[0].length;j++){
        var data_y1=[]
         ymaxData.map((item,key)=>{
                     data_y1.push(ymaxData[key][j])
              })
              var ymax_value = parseFloat((Math.max.apply(Math,data_y1.map(Number))).toFixed(6))
              final_ymax_col.push(ymax_value)

            }
            this.ymaxFinalData= final_ymax_col
            // console.log("y@@",final_ymax_col)
          this.data.map((item,key)=>{
          item.push(this.ymaxFinalData[key])
    })
          var ymax_min = _.floor(_.min(final_ymax_col), 6);   //getting min value of slider
          var ymax_max = _.floor(_.max(final_ymax_col), 6);   //getting max value of slider
          var Ymax_Xrange = _.floor((ymax_max - ymax_min), 6);
          var ymax_1 = ymax_min + 0.1 * Ymax_Xrange;  //setting slider handle points values
          var ymax_2 = ymax_min + 0.3 * Ymax_Xrange;  //setting slider handle points values
          var ymax_3 = ymax_min + 0.5 * Ymax_Xrange;  //setting slider handle points values
          var  ymax_4 = ymax_min + 0.7 * Ymax_Xrange;  //setting slider handle points values
          var  ymax_5 = ymax_min + 0.9 * Ymax_Xrange;  //setting slider handle points values
            temp_data.push({
              ["Ymax"]: {
                "min": ymax_min-0.1*(ymax_max-ymax_min),
                "max": ymax_max+0.1*(ymax_max-ymax_min),
                "point1": ymax_1,
                "point2": ymax_2,
                "point3": ymax_3,
                "point4": ymax_4,
                "point5": ymax_5
              }
            });
          this.setState({ processing: false });
          this.context.updateState({ sliderData: temp_data });

      })

    } else {
      alert("Can not be validate! Please check your inputs values!!")
    }
  }

  handleChange = event => {
    this.csvfile = event.target.files[0];
  };

  //parsing csv file
  importCSV = () => {
    this.setState({ processing: true });

    const { csvfile } = this;

    Papa.parse(csvfile, {
      complete: this.updateData,
      header: false
    });
  };

  updateData(result) {
    // console.log("data oip",this.ymaxFinalData)

    var data = result.data,
      len = parseInt(data[0].length),
      arr = [];
    // data.map((item,key)=>{
    //   // item.push(this.ymaxFinalData[key])
    // })

    for (var i = 1; i <= len; i++) {
      arr.push(i)
    };
    console.log("data is here",data)

    this.data = data;
    this.context.updateData({ data });
    this.context.updateState({ key: arr });

    this.setState({
      processing: false
    })
  }

  render() {
    var contentMarkup = null;
    console.log(this.props, 'propsss');
    var contentMarkup;

    if (this.state.processing) {
      contentMarkup = (
        <div className="spinner tblscrl">
          <div className="lds-roller">
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
          </div>
        </div>
      )
    }
    else if (this.data.length) {
      contentMarkup = (
        <div className="tblscrl">
          <Table bordered>
            <thead style={{ backgroundColor: '#80bfff', borderColor: '#333' }}>
              <tr>
                <th>#</th>
                {this.context.key.map((item) => <th>{item}</th>)}
              </tr>
            </thead>
            <TableData data={this.data} selected_dots={this.context.selected_dots} />
          </Table>
        </div>
      )
    }

    return (
      <Row>
        <Col md="12">
          <Card body outline >
            <div className="App">
              <div>
                <h4>Import moga file</h4>
                <Row style={{ marginBottom: '15px' }}>
                  <input className="csv-input"
                    type="file"
                    ref={input => {
                      this.filesInput = input;
                    }}
                    name="file"
                    placeholder={null}
                    onChange={this.handleChange}
                    style={{ marginLeft: '15px' }}
                  />
                  <p />
                  <Button  color="success" onClick={this.importCSV} style={{ marginLeft: '15px' }} size="sm">Submit</Button>{' '}
                  <Button  type="submit" color="warning" style={{ marginLeft: '15px' ,color:"#fffff"}} onClick={this.toggle} size="sm">Save File</Button>{' '}
                  <Button  color="warning" style={{ marginLeft: '15px' }} onClick={this.toggle1} size="sm">Fetch Save Data</Button>
                </Row>
                <Form >
                  <Row>
                    <InputGroup size="sm" style={{ width: '25%', marginLeft: '15px' }}>
                      <InputGroupAddon addonType="prepend">No of Input</InputGroupAddon>
                      <Input name="input" onChange={e => this.setState({ input: e.target.value })} />
                    </InputGroup>
                    <InputGroup size="sm" style={{ width: '25%', marginLeft: '15px' }}>
                      <InputGroupAddon addonType="prepend">No of Output</InputGroupAddon>
                      <Input name="output" onChange={e => this.setState({ output: e.target.value })} />
                    </InputGroup>
                    <InputGroup size="sm" style={{ width: '25%', marginLeft: '15px' }}>
                      <InputGroupAddon addonType="prepend">No of Constraints</InputGroupAddon>
                      <Input name="constraints" onChange={e => this.setState({ constraint: e.target.value })} />
                    </InputGroup>
                    <Button onClick={e => this.handlesubmit(e)} outline type="submit" color="success" style={{ marginLeft: '15px' }} size="sm">Validate</Button>
                  </Row>
                </Form>
              </div>
              {contentMarkup}
            </div>
          </Card>
        </Col>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Save file</ModalHeader>
          <ModalBody>
          <FormGroup row>
          <Label for="exampleEmail" sm={4}>File name :</Label>
          <Col sm={8}>
            <Input type="text" name="text" id="save-state" placeholder="File name" onChange={this.handleChangeModal}/>
          </Col>
        </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.saveState}>Save</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.modal1} toggle={this.toggle1} className={this.props.className}>
          <ModalHeader toggle={this.toggle1}>Open file</ModalHeader>
          <ModalBody>
          
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </Row>
    )
  };
};

Panel.contextType = SliderContext;

export default Panel;