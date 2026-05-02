<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Project;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ReorderController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em) {}

    #[Route('/api/projects/reorder', name: 'projects_reorder', methods: ['POST'])]
    public function reorderProjects(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $ids = $data['ids'] ?? [];

        $repo = $this->em->getRepository(Project::class);
        foreach ($ids as $index => $id) {
            $project = $repo->find($id);
            if ($project) {
                $project->setPosition($index + 1);
            }
        }
        $this->em->flush();

        return new JsonResponse(['success' => true]);
    }

    #[Route('/api/articles/reorder', name: 'articles_reorder', methods: ['POST'])]
    public function reorderArticles(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $ids = $data['ids'] ?? [];

        $repo = $this->em->getRepository(Article::class);
        foreach ($ids as $index => $id) {
            $article = $repo->find($id);
            if ($article) {
                $article->setPosition($index + 1);
            }
        }
        $this->em->flush();

        return new JsonResponse(['success' => true]);
    }
}
