<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;

use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\HasLifecycleCallbacks]
#[Vich\Uploadable]
#[ApiResource(
    normalizationContext: ['groups' => ['article:read']],
    denormalizationContext: ['groups' => ['article:write']]
)]
#[ApiFilter(SearchFilter::class, properties: ['titleEn' => 'ipartial', 'titleFr' => 'ipartial'])]
class Article
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:read', 'article:write'])]
    private ?string $titleEn = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:read', 'article:write'])]
    private ?string $titleFr = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['article:read', 'article:write'])]
    private ?string $contentEn = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['article:read', 'article:write'])]
    private ?string $contentFr = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['article:read', 'article:write'])]
    private ?\DateTimeImmutable $publishedAt = null;

    #[Vich\UploadableField(mapping: 'article_images', fileNameProperty: 'thumbnailName')]
    private ?File $thumbnailFile = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['article:read'])]
    private ?string $thumbnailName = null;

    #[Vich\UploadableField(mapping: 'article_images', fileNameProperty: 'coverName')]
    private ?File $coverFile = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['article:read'])]
    private ?string $coverName = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['article:read', 'article:write'])]
    private ?array $contentBlocks = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    #[Groups(['article:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToMany(targetEntity: Project::class, inversedBy: 'linkedArticles')]
    #[Groups(['article:read', 'article:write'])]
    private \Doctrine\Common\Collections\Collection $linkedProjects;

    #[ORM\ManyToMany(targetEntity: self::class)]
    #[ORM\JoinTable(name: 'article_related_articles')]
    #[Groups(['article:read', 'article:write'])]
    private \Doctrine\Common\Collections\Collection $relatedArticles;

    public function __construct()
    {
        $this->linkedProjects = new \Doctrine\Common\Collections\ArrayCollection();
        $this->relatedArticles = new \Doctrine\Common\Collections\ArrayCollection();
        $this->publishedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitleEn(): ?string
    {
        return $this->titleEn;
    }

    public function setTitleEn(string $titleEn): static
    {
        $this->titleEn = $titleEn;

        return $this;
    }

    public function getTitleFr(): ?string
    {
        return $this->titleFr;
    }

    public function setTitleFr(string $titleFr): static
    {
        $this->titleFr = $titleFr;

        return $this;
    }

    public function getContentEn(): ?string
    {
        return $this->contentEn;
    }

    public function setContentEn(?string $contentEn): static
    {
        $this->contentEn = $contentEn;

        return $this;
    }

    public function getContentFr(): ?string
    {
        return $this->contentFr;
    }

    public function setContentFr(?string $contentFr): static
    {
        $this->contentFr = $contentFr;

        return $this;
    }

    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(\DateTimeImmutable $publishedAt): static
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    public function getThumbnailFile(): ?File
    {
        return $this->thumbnailFile;
    }

    public function setThumbnailFile(?File $thumbnailFile = null): static
    {
        $this->thumbnailFile = $thumbnailFile;

        if (null !== $thumbnailFile) {
            $this->updatedAt = new \DateTimeImmutable();
        }

        return $this;
    }

    public function getThumbnailName(): ?string
    {
        return $this->thumbnailName;
    }

    public function setThumbnailName(?string $thumbnailName): static
    {
        $this->thumbnailName = $thumbnailName;

        return $this;
    }

    public function getCoverFile(): ?File
    {
        return $this->coverFile;
    }

    public function setCoverFile(?File $coverFile = null): static
    {
        $this->coverFile = $coverFile;

        if (null !== $coverFile) {
            $this->updatedAt = new \DateTimeImmutable();
        }

        return $this;
    }

    public function getCoverName(): ?string
    {
        return $this->coverName;
    }

    public function setCoverName(?string $coverName): static
    {
        $this->coverName = $coverName;

        return $this;
    }

    public function getContentBlocks(): ?array
    {
        return $this->contentBlocks;
    }

    public function setContentBlocks(?array $contentBlocks): static
    {
        $this->contentBlocks = $contentBlocks;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    /**
     * @return \Doctrine\Common\Collections\Collection<int, Project>
     */
    public function getLinkedProjects(): \Doctrine\Common\Collections\Collection
    {
        return $this->linkedProjects;
    }

    public function addLinkedProject(Project $project): static
    {
        if (!$this->linkedProjects->contains($project)) {
            $this->linkedProjects->add($project);
        }

        return $this;
    }

    public function removeLinkedProject(Project $project): static
    {
        $this->linkedProjects->removeElement($project);

        return $this;
    }

    /**
     * @return \Doctrine\Common\Collections\Collection<int, self>
     */
    public function getRelatedArticles(): \Doctrine\Common\Collections\Collection
    {
        return $this->relatedArticles;
    }

    public function addRelatedArticle(self $article): static
    {
        if (!$this->relatedArticles->contains($article)) {
            $this->relatedArticles->add($article);
        }

        return $this;
    }

    public function removeRelatedArticle(self $article): static
    {
        $this->relatedArticles->removeElement($article);

        return $this;
    }
}
