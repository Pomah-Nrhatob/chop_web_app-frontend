'use client'

import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react'

export default function OneDayDialog({ open, setOpen }) {
  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner
          display="flex"
          alignItems={{ base: 'center', md: 'flex-start' }}
          justifyContent="center"
        >
          <Dialog.Content w={{ base: 'calc(100vw - 24px)', md: '100%' }}>
            <Dialog.Header>
              <Dialog.Title>День с данными</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body></Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button>Save</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
