
type Props = {
    is_enable: boolean
}
export default function IsEnabled({ is_enable }: Props) {
    return is_enable ? 'Hoạt động' : 'Không hoạt động'
}