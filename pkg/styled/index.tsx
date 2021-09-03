import styled from 'styled-components'
import cn from 'classnames'
import {
  Card,
  LinkButton,
  typographyH2Styles,
  typographyLinkStyles
} from '@ory/themes'

export const MarginCard = styled(Card)`
  margin-top: 70px;
  margin-bottom: 18px;
`

export const ActionCard = styled(Card)`
  margin-bottom: 18px;
`

export const CenterLink = styled.a`
  ${typographyH2Styles};
  ${typographyLinkStyles};
  text-align: center;
  font-size: 15px;
`

export const TextLeftButton = styled(LinkButton)`
  box-sizing: border-box;

  & .linkButton {
    box-sizing: border-box;
  }

  & a {
    &:hover,
    &,
    &:active,
    &:focus,
    &:visited {
      text-align: left;
    }
  }
`

export interface DocsButtonProps {
  title: string
  href: string
  testid: string
  disabled?: boolean
  unresponsive?: boolean
}

export const DocsButton = ({
  title,
  href,
  testid,
  disabled,
  unresponsive
}: DocsButtonProps) => (
  <div className={cn('col-xs-4', { 'col-md-12': !unresponsive })}>
    <div className="box">
      <TextLeftButton disabled={disabled} data-testid={testid} href={href}>
        {title}
      </TextLeftButton>
    </div>
  </div>
)
