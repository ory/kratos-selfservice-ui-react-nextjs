import errorIcon from '../../public/noti-icons/error.svg'
import infoIcon from '../../public/noti-icons/info.svg'
import successIcon from '../../public/noti-icons/success.svg'
import warningIcon from '../../public/noti-icons/warning.svg'
import Image from 'next/image'
import { toast, cssTransition } from 'react-toastify'

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}
export interface NotificationOption {
  content: string
  type: NotificationType
}

export default function showNotification(option: NotificationOption) {
  switch (option.type) {
    case 'error':
      toast.error(option.content, {
        icon: () => <Image src={errorIcon} />
      })
      break
    case 'success':
      toast.success(option.content, {
        icon: () => <Image src={successIcon} />
      })
      break
    case 'info':
      toast.info(option.content, {
        icon: () => <Image src={infoIcon} />
      })
      break
    case 'warning':
      toast.warning(option.content, {
        icon: () => <Image src={warningIcon} />
      })
      break
    default:
      toast(option.content)
  }
}
