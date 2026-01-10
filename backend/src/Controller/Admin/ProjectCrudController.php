<?php

namespace App\Controller\Admin;

use App\Entity\Project;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CodeEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\UrlField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;

class ProjectCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Project::class;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            TextField::new('titleEn', 'Title (EN)'),
            TextField::new('titleFr', 'Title (FR)'),
            TextEditorField::new('descriptionEn', 'Description (EN)'),
            TextEditorField::new('descriptionFr', 'Description (FR)'),
            UrlField::new('link', 'Project Link'),
            TextField::new('thumbnailUrl', 'Thumbnail URL'),
            TextField::new('coverUrl', 'Cover URL'),
            CodeEditorField::new('contentBlocks', 'Content Blocks (JSON)')
                ->setLanguage('js')
                ->hideOnIndex(),
            DateTimeField::new('createdAt')->hideOnForm(),
        ];
    }
}
