import { CrmHeader } from '@/widgets/header'

export default function layout({ children }) {
  return (
    <div>
      <CrmHeader />
      <div>{children}</div>
    </div>
  )
}
