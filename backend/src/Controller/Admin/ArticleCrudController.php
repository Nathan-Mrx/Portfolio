<?php

namespace App\Controller\Admin;

use App\Entity\Article;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CodeEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;

class ArticleCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Article::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            TextField::new('titleEn', 'Title (EN)'),
            TextField::new('titleFr', 'Title (FR)'),
            TextEditorField::new('contentEn', 'Summary (EN)'),
            TextEditorField::new('contentFr', 'Summary (FR)'),
            TextField::new('thumbnailUrl', 'Thumbnail URL'),
            TextField::new('coverUrl', 'Cover URL'),
            CodeEditorField::new('contentBlocks', 'Content Blocks (JSON)')
                ->setLanguage('js')
                ->hideOnIndex(),
            DateTimeField::new('publishedAt'),
        ];
    }
}
