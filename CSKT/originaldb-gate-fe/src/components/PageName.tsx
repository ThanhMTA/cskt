type Props = {
    title: string
}
export default function PageName({ title }: Props) {
    return <>
        <section className="container text-white -mt-[15px]">
            <h3 className="h-3 uppercase font-bold text-3xl text-[22px] text-center tracking-wider">
                {/* {getMenuFlat([...NAVBAR_ITEMS])?.find(item => item?.route === location?.pathname)?.label?.split('-')?.join("")} */}
                {title}
            </h3>
        </section>
    </>
}