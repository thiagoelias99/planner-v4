"use client"

import { testAction2 } from "@/actions/test/test.action"
import { Button } from "@/components/ui/button"

export default function TestPage2() {

  return (
    <div>
      <Button
        onClick={async () => {
          const response = await testAction2()
          console.log("Test Action 2 Response:", response)
          console.log("Response from testAction2:", response.data)
        }}

      >Test Page 2 Button</Button>
    </div>
  )
}
