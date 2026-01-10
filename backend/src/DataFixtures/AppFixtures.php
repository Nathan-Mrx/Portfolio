<?php

namespace App\DataFixtures;

use App\Entity\Article;
use App\Entity\Project;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Create Admin User
        $user = new User();
        $user->setEmail('admin@example.com');
        $user->setRoles(['ROLE_ADMIN']);
        $password = $this->hasher->hashPassword($user, 'password');
        $user->setPassword($password);
        $manager->persist($user);

        // Create Sample Project
        $project = new Project();
        $project->setTitleEn('Portfolio Website');
        $project->setTitleFr('Site Web Portfolio');
        $project->setDescriptionEn('A beautiful portfolio built with Next.js and Symfony.');
        $project->setDescriptionFr('Un portfolio magnifique construit avec Next.js et Symfony.');
        $project->setLink('https://github.com/Nathan-Mrx/Portfolio');
        $project->setImageUrl('https://placehold.co/600x400');
        $manager->persist($project);

        // Create Sample Article
        $article = new Article();
        $article->setTitleEn('Getting Started with Symfony');
        $article->setTitleFr('Débuter avec Symfony');
        $article->setContentEn('Symfony is a great PHP framework...');
        $article->setContentFr('Symfony est un excellent framework PHP...');
        $manager->persist($article);

        $manager->flush();
    }
}
