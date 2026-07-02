import React, { useState } from 'react'
import "./Faq.css"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"

const Faq_getail = ({ data }) => {
    const [faq, setFaq] = useState(false)

    return (
        <div onClick={() => setFaq(!faq)} className="tour_block">
            <div className='flex'>
                <h1>{data.question}</h1>
                {faq ?
                    <IoIosArrowUp onClick={() => setFaq(!faq)} className='icon_faq' size={22} />
                    :
                    <IoIosArrowDown onClick={() => setFaq(!faq)} className='icon_faq' size={22} />}
            </div>
            {faq && <div>
                {React.createElement("p", {
                    dangerouslySetInnerHTML: {
                        __html: data.answer ? data.answer : "",
                    },
                })}
            </div>}
        </div>
    )
}

export default Faq_getail