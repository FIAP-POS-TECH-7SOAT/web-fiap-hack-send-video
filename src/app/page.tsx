"use client";

import { ToastManager } from "@/components/toast-manager";
import { Button, Card, CardBody, Input, Progress } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApplicationError } from "./errors/application-erro";


export default function UploadVideo() {
  const router = useRouter();
  const [videoFile, setVideoFile] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadId, setUploadId] = useState(null);
  const { data: session } = useSession();

  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (event:any) => {
    setVideoFile(event.target.files[0]);
    setUploadProgress(0); // Reseta o progresso ao selecionar um novo arquivo
  };

  const uploadChunk = async (file:any, partNumber:any, totalParts:any,fileName:string):Promise<{next_part:number}> => {
    try {
      if(!videoFile){
        
        
        throw new ApplicationError('Por favor, selecione um arquivo de vídeo.');

      }
      
      const formData = new FormData();
      formData.append("video", file);
      formData.append("part_number", partNumber);
      formData.append("total_parts", totalParts);
      formData.append("file_name", fileName);
      formData.append("upload_id", uploadId || '');
      

      
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/videos/send-part`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });
    

        if (!response.ok) {
          throw new ApplicationError(`Erro ao enviar file ${partNumber}`);
          
        }
        const json = await response.json()
        setUploadId(json.upload_id);
        return {next_part:json.next_part}
      
    } catch (error) {
      
      throw error
    }
  };

  const handleUpload = async () => {
   try {
    if (!videoFile) {
      
      throw new ApplicationError('Por favor, selecione um arquivo de vídeo.');
      
    }
    const totalParts = Math.ceil(videoFile.size / CHUNK_SIZE);
    

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/videos/last-part?file_name=${videoFile.name}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      }
    )

    const json = await response.json();

    
    
    let nextPart = json.part_number ? json.part_number - 1: 0;


    for (let i =  nextPart; i < totalParts; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, videoFile.size);
      const file = videoFile.slice(start, end);

      try {
        await uploadChunk(file, i+1, totalParts,videoFile.name);
        setUploadProgress(((i + 1) / totalParts) * 100);
        if(i+1>=totalParts){
          ToastManager.success('Upload realizado com sucesso.',3000);
        }
      } catch(error) {
        throw error
        
      }
    }
   } catch (error) {
    if(error instanceof ApplicationError){
      
      ToastManager.error(error.message,3000);
    }else{

      ToastManager.error('Erro ao enviar o arquivo. Tente novamente.',3000);
    }
   }

    
  };
  const handleNewUpload = async () => {

  
    router.push("/");
    setVideoFile(null);
    setUploadProgress(0);
    setUploadId(null)

    
  };

  return (
    <div className="flex justify-center p-6">
      <Card className="p-6 shadow-md">
        <CardBody>
          <p className="text-center mb-4">Upload de Vídeo</p>
          <div className="mb-4">
            <Input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              fullWidth
              label="Selecione um vídeo"
              aria-label="Selecione um vídeo para upload"
              
            />
          </div>
          {uploadProgress > 0 && (
    
            <>
              <Progress
                aria-label="Downloading..."
                className="max-w-md mb-3"
                color="success"
                showValueLabel={true}
                size="md"
                value={Math.round(uploadProgress)}
              />
              {Math.round(uploadProgress)>=100 &&
              <Button onPress={handleNewUpload} color="primary" fullWidth className="mt-2">
                Novo envio
              </Button>
              }
            </>
            
          )}
          
          <Button className="mt-2" onPress={handleUpload} color="primary" fullWidth isDisabled={Math.round(uploadProgress)>=100} isLoading={Math.round(uploadProgress)>0 && Math.round(uploadProgress)<100}>
            Fazer Upload
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
