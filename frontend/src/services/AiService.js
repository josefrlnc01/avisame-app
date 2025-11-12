import { generateText, streamText } from 'ai'
import { openRouter } from '../../lib/ai'


    export async function generateInterest (prompt) {
        const result = generateText({
            model : openRouter('meituan/longcat-flash-chat:free'),
           
            prompt : `Dime noticias en base a los siguientes intereses : ${prompt}`,
             system : 'Eres un periodista experto'
        })
        return (await result).text
    }



