<?php

namespace App\Controller;

use App\Entity\MediaObject;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class UploadController extends AbstractController
{
    #[Route('/api/upload/media', name: 'api_upload_media', methods: ['POST'])]
    public function __invoke(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $uploadedFile = $request->files->get('file');

            if (!$uploadedFile) {
                return new JsonResponse(['error' => 'File not found. Please ensure you are sending a file with key "file".'], 400);
            }

            $mediaObject = new MediaObject();
            $mediaObject->file = $uploadedFile;

            // VichUploader handles the file move on persist/flush
            $entityManager->persist($mediaObject);
            $entityManager->flush();

            return new JsonResponse([
                'id' => $mediaObject->getId(),
                'contentUrl' => '/uploads/media/' . $mediaObject->filePath,
                'filePath' => $mediaObject->filePath,
                // Add @id for compatibility if needed elsewhere
                '@id' => '/api/media_objects/' . $mediaObject->getId(),
            ], 201);

        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}
