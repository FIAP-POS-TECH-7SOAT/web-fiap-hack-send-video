"use client";


import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GiVideoCamera } from "react-icons/gi";
import { Badge, Button, Card, CardBody, Chip, CircularProgress, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, Table, TableBody, TableCell, TableColumn, TableHeader,TableRow } from "@nextui-org/react";
import {  useRouter,Router,} from "next/router";
import { usePathname } from "next/navigation";
import { IoMdTimer } from "react-icons/io";


import { CiCircleAlert,CiCircleCheck, CiRedo } from "react-icons/ci";
import { TbProgress } from "react-icons/tb";

import { IoCloudDownloadOutline } from "react-icons/io5";
import Loading from "@/app/loading";






interface VideoItem {
  id: string;
  title: string;
  url?: string;
  created_at: string;
  status: "processing" | "processed" | "error" | 'uploaded';
}

// const videos: VideoItem[] = [
//   {
//     id: "1",
//     title: "Introdução ao Next.js",
//     url: "https://example.com/download/video1.zip",
//     created_at: "2025-01-25T12:00:00Z",
//     status: "processed",
//   },
//   {
//     id: "2",
//     title: "Configurando Tailwind CSS",
//     created_at: "2025-01-26T15:00:00Z",
//     status: "processing",
//   },
//   {
//     id: "3",
//     title: "Deploy com Docker",
//     url: "",
//     created_at: "2025-01-27T10:00:00Z",
//     status: "error",
//   },
// ];

export default function Uploads() {
  const { data: session } = useSession();
  const [videos,setVideos] = useState<VideoItem[]>([])
  useEffect(()=>{
    async function load(){
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/videos`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
        },
      });
      if(!response.ok){
        return
      }

      const json = await response.json();
      setVideos(json.videos)
    }
    load()
  },[session?.user?.token])
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Listagem de Vídeos</h1>
      
        <Table>
          <TableHeader>
            
            <TableColumn className="py-2">Título</TableColumn>
            <TableColumn className="py-2">Data de Upload</TableColumn>
            <TableColumn className="py-2">Status</TableColumn>
            <TableColumn className="py-2">Ações</TableColumn>
            
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow  key={video.id} className="border-t">
                <TableCell className="py-2">{video.title}</TableCell>
                <TableCell className="py-2">
                  {new Date(video.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="py-2">
                  {video.status === "processed" && (
                    <Chip color="success">
                      <CiCircleCheck size={16} className="mr-1 inline" />
                      processed
                    </Chip>
                  )}
                  {video.status === "processing" && (
                    <Chip  color="primary">
                      <TbProgress size={16} className="mr-1 inline" />
                      <CircularProgress aria-label="Processing..." size="sm" />
                      
                    </Chip >
                  )}
                  {video.status === "error" && (
                    <Chip  color="danger">
                      <CiCircleAlert  size={16} className="mr-1 inline" />
                      error
                    </Chip >
                  )}
                  {video.status === "uploaded" && (
                    <Chip  color="warning">
                      <IoMdTimer  size={16} className="mr-1 inline" />
                      waiting
                    </Chip >
                  )}
                </TableCell>
                <TableCell className="py-2">
                  {video.url ? (
                    <Button
                      as="a"
                      href={video.url}
                      download
                      variant="solid"
                      className="flex items-center"
                    >
                      <IoCloudDownloadOutline size={16} className="mr-1" />
                      Baixar
                    </Button>
                  ) : video.status==='error'?<Link href="/"><CiRedo className="mr-2"/> Upload again</Link>:(
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
   
    </div>
  );
}
