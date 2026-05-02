<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\ProjectRepository;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;

use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ORM\HasLifecycleCallbacks]
#[Vich\Uploadable]
#[ApiResource(
    normalizationContext: ['groups' => ['project:read']],
    denormalizationContext: ['groups' => ['project:write']],
    order: ['position' => 'ASC', 'createdAt' => 'DESC'],
    paginationEnabled: true,
    paginationItemsPerPage: 8,
    paginationClientItemsPerPage: true,
    paginationClientEnabled: true
)]
#[ApiFilter(SearchFilter::class, properties: ['titleEn' => 'ipartial', 'titleFr' => 'ipartial'])]
#[ApiFilter(OrderFilter::class, properties: ['position' => 'ASC', 'createdAt' => 'DESC'])]
#[ApiFilter(BooleanFilter::class, properties: ['featured'])]
class Project
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['project:read', 'article:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['project:read', 'project:write', 'article:read'])]
    private ?string $titleEn = null;

    #[ORM\Column(length: 255)]
    #[Groups(['project:read', 'project:write', 'article:read'])]
    private ?string $titleFr = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['project:read', 'project:write', 'article:read'])]
    private ?string $descriptionEn = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['project:read', 'project:write', 'article:read'])]
    private ?string $descriptionFr = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['project:read', 'project:write', 'article:read'])]
    private ?string $resumeHighlightsEn = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['project:read', 'project:write', 'article:read'])]
    private ?string $resumeHighlightsFr = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['project:read', 'project:write'])]
    private ?string $link = null;

    #[Vich\UploadableField(mapping: 'project_images', fileNameProperty: 'thumbnailName')]
    private ?File $thumbnailFile = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['project:read'])]
    private ?string $thumbnailName = null;

    #[Vich\UploadableField(mapping: 'project_images', fileNameProperty: 'coverName')]
    private ?File $coverFile = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['project:read'])]
    private ?string $coverName = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['project:read', 'project:write'])]
    private ?array $contentBlocks = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    #[Groups(['project:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToMany(targetEntity: Article::class, mappedBy: 'linkedProjects')]
    #[Groups(['project:read', 'project:write'])]
    private \Doctrine\Common\Collections\Collection $linkedArticles;

    #[ORM\ManyToMany(targetEntity: self::class)]
    #[ORM\JoinTable(name: 'project_related_projects')]
    #[Groups(['project:read', 'project:write'])]
    private \Doctrine\Common\Collections\Collection $relatedProjects;

    #[ORM\Column]
    #[Groups(['project:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['project:read', 'project:write'])]
    private ?int $position = null;

    #[ORM\Column(options: ['default' => false])]
    #[Groups(['project:read', 'project:write'])]
    private bool $featured = false;

    public function __construct()
    {
        $this->linkedArticles = new \Doctrine\Common\Collections\ArrayCollection();
        $this->relatedProjects = new \Doctrine\Common\Collections\ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
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

    public function getDescriptionEn(): ?string
    {
        return $this->descriptionEn;
    }

    public function setDescriptionEn(?string $descriptionEn): static
    {
        $this->descriptionEn = $descriptionEn;

        return $this;
    }

    public function getDescriptionFr(): ?string
    {
        return $this->descriptionFr;
    }

    public function setDescriptionFr(?string $descriptionFr): static
    {
        $this->descriptionFr = $descriptionFr;

        return $this;
    }

    public function getResumeHighlightsEn(): ?string
    {
        return $this->resumeHighlightsEn;
    }

    public function setResumeHighlightsEn(?string $resumeHighlightsEn): self
    {
        $this->resumeHighlightsEn = $resumeHighlightsEn;
        return $this;
    }

    public function getResumeHighlightsFr(): ?string
    {
        return $this->resumeHighlightsFr;
    }

    public function setResumeHighlightsFr(?string $resumeHighlightsFr): self
    {
        $this->resumeHighlightsFr = $resumeHighlightsFr;
        return $this;
    }

    public function getLink(): ?string
    {
        return $this->link;
    }

    public function setLink(?string $link): static
    {
        $this->link = $link;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

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

    #[Groups(['project:read', 'article:read'])]
    public function getThumbnailUrl(): ?string
    {
        if (!$this->thumbnailName) {
            return null;
        }
        return '/uploads/media/' . $this->thumbnailName;
    }

    #[Groups(['project:write'])]
    public function setThumbnailUrl(?string $thumbnailUrl): static
    {
        if ($thumbnailUrl) {
            $this->thumbnailName = basename($thumbnailUrl);
        } else {
            $this->thumbnailName = null;
        }
        
        return $this;
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

    #[Groups(['project:read'])]
    public function getCoverUrl(): ?string
    {
        if (!$this->coverName) {
            return null;
        }
        return '/uploads/media/' . $this->coverName;
    }

    #[Groups(['project:write'])]
    public function setCoverUrl(?string $coverUrl): static
    {
        if ($coverUrl) {
            $this->coverName = basename($coverUrl);
        } else {
            $this->coverName = null;
        }

        return $this;
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
     * @return \Doctrine\Common\Collections\Collection<int, Article>
     */
    public function getLinkedArticles(): \Doctrine\Common\Collections\Collection
    {
        return $this->linkedArticles;
    }

    public function addLinkedArticle(Article $article): static
    {
        if (!$this->linkedArticles->contains($article)) {
            $this->linkedArticles->add($article);
            $article->addLinkedProject($this);
        }

        return $this;
    }

    public function removeLinkedArticle(Article $article): static
    {
        if ($this->linkedArticles->removeElement($article)) {
            $article->removeLinkedProject($this);
        }

        return $this;
    }

    /**
     * @return \Doctrine\Common\Collections\Collection<int, self>
     */
    public function getRelatedProjects(): \Doctrine\Common\Collections\Collection
    {
        return $this->relatedProjects;
    }

    public function addRelatedProject(self $project): static
    {
        if (!$this->relatedProjects->contains($project)) {
            $this->relatedProjects->add($project);
        }

        return $this;
    }

    public function removeRelatedProject(self $project): static
    {
        $this->relatedProjects->removeElement($project);

        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(?int $position): static
    {
        $this->position = $position;
        return $this;
    }

    public function isFeatured(): bool
    {
        return $this->featured;
    }

    public function setFeatured(bool $featured): static
    {
        $this->featured = $featured;
        return $this;
    }
}
