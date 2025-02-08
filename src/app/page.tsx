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
  const [uploadId, setUploadId] = useState<string|null>(null);
  const { data: session } = useSession();

  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (event:any) => {
    setVideoFile(event.target.files[0]);
    setUploadProgress(0); // Reseta o progresso ao selecionar um novo arquivo
  };

  const uploadChunk = async (file:any, partNumber:any, totalParts:any,fileName:string,upload_id:string) => {
    try {
      console.log('PARTESSSssss', partNumber);
      
      if(!videoFile){
        
        
        throw new ApplicationError('Por favor, selecione um arquivo de vídeo.');

      }
      
      const formData = new FormData();
      formData.append("video", file);
      formData.append("part_number", partNumber);
      formData.append("total_parts", totalParts);
      formData.append("file_name", fileName);
      formData.append("upload_id", upload_id);
      

      
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/videos/send-part`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        });
        setUploadProgress((partNumber / totalParts) * 100);

        if (!response.ok) {
          throw new ApplicationError(`Erro ao enviar file ${partNumber}`);
          
        }
        const json = await response.json()
        setUploadId(upload_id);
       
      
    } catch (error) {
      
      throw error
    }
  };

 
  const handleNewUpload = async () => {

  
    router.push("/");
    setVideoFile(null);
    setUploadProgress(0);
    setUploadId(null)

    
  };

  const handleUpload2 = async () => {
    try {
     if (!videoFile) {
       
       throw new ApplicationError('Por favor, selecione um arquivo de vídeo.');
       
     }
     const totalParts = Math.ceil(videoFile.size / CHUNK_SIZE);
     
 
     const responseGenerateKey = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/videos/generate-upload-key`,
       {
          method:"POST",
          body:JSON.stringify({
            file_name: videoFile.name,
            total_parts:totalParts
          }),
         headers: {
           Authorization: `Bearer ${session?.user?.token}`,
           "Content-Type": "application/json"
         },
       }
     )

     if(!responseGenerateKey.ok){
      throw new Error('Erro ao gerar upload id')
     }
     const jsonGenerate = await responseGenerateKey.json();

     const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/videos/missing-parts?file_name=${videoFile.name}`,
       {
         headers: {
           Authorization: `Bearer ${session?.user?.token}`,
         },
       }
     )
 
     const json = await response.json();
 
     
     
     let missing_parts:number[] = json?.missing_parts && json?.missing_parts.length >0?json?.missing_parts : Array.from(
      { length: totalParts },
      (_, i) => i + 1,
    );
    

    missing_parts.forEach((part,index)=>{
      console.log('enviando parte',part);
      
      const start = index * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, videoFile.size);
      const file = videoFile.slice(start, end);

      try {
        uploadChunk(file, part, totalParts,videoFile.name,jsonGenerate.upload_id);
        
     
      } catch(error) {
        throw error
        
      }
    })
 
  
    } catch (error) {
     if(error instanceof ApplicationError){
       
       ToastManager.error(error.message,3000);
     }else{
 
       ToastManager.error('Erro ao enviar o arquivo. Tente novamente.',3000);
     }
    }
 
     
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
          
          <Button className="mt-2" onPress={handleUpload2} color="primary" fullWidth isDisabled={Math.round(uploadProgress)>=100} isLoading={Math.round(uploadProgress)>0 && Math.round(uploadProgress)<100}>
            Fazer Upload
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
