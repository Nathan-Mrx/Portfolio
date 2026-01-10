<?php

namespace App\Controller;

use App\Entity\MediaObject;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

use Doctrine\ORM\EntityManagerInterface;

#[AsController]
final class CreateMediaObjectAction extends AbstractController
{
    public function __invoke(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $uploadedFile = $request->files->get('file');
        
        if (!$uploadedFile) {
            throw new BadRequestHttpException('"file" is required');
        }

        $mediaObject = new MediaObject();
        $mediaObject->file = $uploadedFile;

        $entityManager->persist($mediaObject);
        $entityManager->flush();

        return new JsonResponse([
            'id' => $mediaObject->getId(),
            'contentUrl' => '/uploads/media/' . $mediaObject->filePath,
            '@id' => '/api/media_objects/' . $mediaObject->getId(),
            '@type' => 'https://schema.org/MediaObject',
            'filePath' => $mediaObject->filePath
        ], 201);
    }
}
