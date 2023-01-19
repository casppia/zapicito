import { AntDesignOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React from 'react';

const UserAvatar = () => {
  return (
    <Avatar
    size={{
      xs: 40,
      sm: 40,
      md: 46,
      lg: 46,
      xl: 46,
      xxl: 56,
    }}
    icon={<AntDesignOutlined />}
  />
  )
}

export default UserAvatar