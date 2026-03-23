import { CrmHeader } from '@/widgets/crmHeader/ui/CrmHeader'

export default function layout({ children }) {
  return (
    <div>
      <CrmHeader />
      <div>{children}</div>
    </div>
  )
}
