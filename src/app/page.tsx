'use client'
import { Button, Popover, Text } from '@mantine/core'
import React from 'react'

const Homepage = () => {
  return (
    <div>
      <Popover width={200} position="bottom" withArrow shadow="md">
        <Popover.Target>
          <Button>Toggle popover</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="xs">This is uncontrolled popover, it is opened when button is clicked</Text>
        </Popover.Dropdown>
      </Popover>
    </div>
  )
}

export default Homepage
