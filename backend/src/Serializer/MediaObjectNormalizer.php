<?php

namespace App\Serializer;

use App\Entity\MediaObject;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Vich\UploaderBundle\Storage\StorageInterface;

final class MediaObjectNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'MEDIA_OBJECT_NORMALIZER_ALREADY_CALLED';

    public function __construct(private StorageInterface $storage)
    {
    }

    public function normalize($object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        file_put_contents('/tmp/normalizer_hit.log', "Normalizer hit for access. ID: " . ($object->getId() ?? 'null') . "\n", FILE_APPEND);
        $context[self::ALREADY_CALLED] = true;

        // Only resolve URI if the file has been uploaded and saved
        if ($object->filePath) {
            try {
                $object->contentUrl = $this->storage->resolveUri($object, 'file');
            } catch (\Exception $e) {
                // Return null contentUrl on error instead of crashing
                $object->contentUrl = null;
                // Log silently if needed but do not throw
            }
        }

        return $this->normalizer->normalize($object, $format, $context);
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof MediaObject;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            MediaObject::class => true,
        ];
    }
}
