import React, { useState } from 'react'
import {
  Space,
  Form,
  TimePicker
} from 'antd';
import moment from 'moment';

export const BranchEditWorkHours = ({editSchedule}) => {
  const [timeString, setTimeString] = useState('');
  const [branchInfo, setBranchInfo] = useState(editSchedule);
  // console.log(moment('1230', 'hmm').format('HH:mm'))
  const format = 'HH:mm';
  return (
    <>
      <div className='workhours__edit-panel'>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        // onValuesChange={}
        // disabled={}
      >
      <Space style={{ display: "flex", marginBottom: 8 }} align="baseline">

      <Form.Item label="From" name="from">
        <TimePicker 
        // defaultValue={moment('12:00', format)} 
        format={format} 
        onOk={(time) => {
        setTimeString(time.format("HHmm"));
        // console.log(time.format("HHmm"));
      }}/>
      </Form.Item>
      <Form.Item label="To" name="to">
        <TimePicker 
          // defaultValue={moment('12:08', format)} 
          format={format} />
      </Form.Item>
      </Space>

      </Form>
      </div>
    </>
  )
}