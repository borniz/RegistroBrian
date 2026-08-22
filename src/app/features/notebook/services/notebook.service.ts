import { Service } from '@angular/core';
import { note_book } from '../models/notebook.model';
import { supabase } from '../../../core/supabase/supabase.client';

@Service()
export class NotebookService {

    async crearRegistro(notebook:note_book){
        const payload  = {
            id : notebook.idNote,
            description : notebook.description,
            vehicleId:notebook.vehicleId,
            price:notebook.price,
            createDate:notebook.createDate

        }
  console.log('Enviando este payload mapeado a Supabase:', payload);

        const {data,error} =await  supabase.from('note_book').insert(payload).select();

        if (error){
            console.error('Error en la creacion del registro');
            throw error;
        }
        return data ? data[0]:null;
    }
}
